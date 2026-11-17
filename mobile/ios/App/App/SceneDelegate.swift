import UIKit
import Capacitor
import WidgetKit
import AVFoundation
import UserNotifications

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = AppViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

/// Registers the app's own plugins with Capacitor.
class AppViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(WidgetBridgePlugin())
        bridge?.registerPluginInstance(PrivacyPlugin())
        bridge?.registerPluginInstance(SecureStorePlugin())
        bridge?.registerPluginInstance(SermonRecorderPlugin())
    }
}

/// WidgetBridge: the web app hands today's verse / thanks / passage to the home-screen widgets
/// (App Group "group.org.dailyjourney.dailybible"), then asks WidgetKit to redraw them.
@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise)]
    @objc func update(_ call: CAPPluginCall) {
        UserDefaults(suiteName: "group.org.dailyjourney.dailybible")?.set(call.getString("json") ?? "{}", forKey: "widget")
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }
}

/// Privacy: iOS doesn't let apps block screenshots. While other people's group posts are on screen this plugin
/// tells the web app when the screen is being recorded / mirrored (it blurs itself) and when a screenshot was taken.
@objc(PrivacyPlugin)
public class PrivacyPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PrivacyPlugin"
    public let jsName = "Privacy"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "protect", returnType: CAPPluginReturnPromise)]
    private var observers: [NSObjectProtocol] = []

    override public func load() {
        let nc = NotificationCenter.default
        observers.append(nc.addObserver(forName: UIApplication.userDidTakeScreenshotNotification, object: nil, queue: .main) { [weak self] _ in
            self?.notifyListeners("screenshot", data: [:])
        })
        observers.append(nc.addObserver(forName: UIScreen.capturedDidChangeNotification, object: nil, queue: .main) { [weak self] _ in
            self?.notifyListeners("captured", data: ["on": UIScreen.main.isCaptured])
        })
    }

    @objc func protect(_ call: CAPPluginCall) {
        DispatchQueue.main.async { self.notifyListeners("captured", data: ["on": UIScreen.main.isCaptured]) }
        call.resolve()
    }
}

/// SecureStore: small secrets (the privacy-lock key) in the iOS Keychain — encrypted by the system,
/// readable only by this app on this device (not included in backups that move to other devices).
@objc(SecureStorePlugin)
public class SecureStorePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SecureStorePlugin"
    public let jsName = "SecureStore"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise)
    ]
    private func base(_ key: String) -> [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: "org.dailyjourney.dailybible.secure",
         kSecAttrAccount as String: key]
    }
    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else { call.reject("key required"); return }
        var q = base(key); q[kSecReturnData as String] = true; q[kSecMatchLimit as String] = kSecMatchLimitOne
        var out: AnyObject?
        if SecItemCopyMatching(q as CFDictionary, &out) == errSecSuccess, let d = out as? Data, let v = String(data: d, encoding: .utf8) {
            call.resolve(["value": v])
        } else { call.resolve(["value": NSNull()]) }
    }
    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value") else { call.reject("key and value required"); return }
        SecItemDelete(base(key) as CFDictionary)
        var q = base(key)
        q[kSecValueData as String] = Data(value.utf8)
        q[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        let st = SecItemAdd(q as CFDictionary, nil)
        st == errSecSuccess ? call.resolve() : call.reject("keychain error \(st)")
    }
    @objc func remove(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else { call.reject("key required"); return }
        SecItemDelete(base(key) as CFDictionary); call.resolve()
    }
}

/// SermonRecorder: records a whole sermon natively so it keeps going with the screen off or the app in the background
/// (UIBackgroundModes: audio). Phone calls: a ringing call that isn't answered doesn't stop it; if the call is answered,
/// iOS pauses the microphone, and recording picks up again by itself when the call ends (the gap is just skipped).
/// AAC mono 22 kHz / 48 kbps — about 21 MB an hour, plenty for speech recognition.
@objc(SermonRecorderPlugin)
public class SermonRecorderPlugin: CAPPlugin, CAPBridgedPlugin, AVAudioRecorderDelegate {
    public let identifier = "SermonRecorderPlugin"
    public let jsName = "SermonRecorder"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pause", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resume", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "discard", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise)
    ]
    private var recorder: AVAudioRecorder?
    private var fileURL: URL?
    private var state = "idle"            // idle | recording | paused | interrupted
    private var userPaused = false
    private var observers: [NSObjectProtocol] = []
    private var noteTitle = "", noteBody = ""
    private let reminderId = "sermon-rec-paused"

    override public func load() {
        let nc = NotificationCenter.default
        observers.append(nc.addObserver(forName: AVAudioSession.interruptionNotification, object: nil, queue: .main) { [weak self] n in self?.interrupted(n) })
        observers.append(nc.addObserver(forName: AVAudioSession.mediaServicesWereResetNotification, object: nil, queue: .main) { [weak self] _ in self?.resumeIfNeeded() })
        observers.append(nc.addObserver(forName: UIApplication.willEnterForegroundNotification, object: nil, queue: .main) { [weak self] _ in self?.resumeIfNeeded() })
    }

    private func session() throws {
        let s = AVAudioSession.sharedInstance()
        // mixWithOthers: other apps' sounds don't stop the recording; only a phone/FaceTime call can.
        try s.setCategory(.playAndRecord, mode: .default, options: [.mixWithOthers, .allowBluetooth, .defaultToSpeaker])
        try s.setActive(true)
    }

    @objc func start(_ call: CAPPluginCall) {
        noteTitle = call.getString("pausedTitle") ?? "Recording paused"
        noteBody = call.getString("pausedText") ?? "Open the app to continue recording."
        AVAudioSession.sharedInstance().requestRecordPermission { ok in
            DispatchQueue.main.async {
                guard ok else { call.reject("microphone_denied", "microphone_denied"); return }
                do {
                    try self.session()
                    let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("sermons", isDirectory: true)
                    try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
                    let url = dir.appendingPathComponent("rec-\(Int(Date().timeIntervalSince1970)).m4a")
                    let settings: [String: Any] = [AVFormatIDKey: kAudioFormatMPEG4AAC, AVSampleRateKey: 22050, AVNumberOfChannelsKey: 1,
                                                   AVEncoderBitRateKey: 48000, AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue]
                    let r = try AVAudioRecorder(url: url, settings: settings)
                    r.delegate = self; r.isMeteringEnabled = true
                    guard r.record() else { call.reject("start_failed"); return }
                    self.recorder = r; self.fileURL = url; self.state = "recording"; self.userPaused = false
                    UIApplication.shared.isIdleTimerDisabled = false   // the screen may lock; recording continues
                    self.emit()
                    call.resolve(["path": url.absoluteString])
                } catch { call.reject("start_failed", nil, error) }
            }
        }
    }
    @objc func pause(_ call: CAPPluginCall) {
        DispatchQueue.main.async { self.recorder?.pause(); self.userPaused = true; self.state = "paused"; self.emit(); call.resolve(self.info()) }
    }
    @objc func resume(_ call: CAPPluginCall) {
        DispatchQueue.main.async { self.userPaused = false; self.resumeIfNeeded(); call.resolve(self.info()) }
    }
    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let r = self.recorder, let url = self.fileURL else { call.reject("not_recording"); return }
            let seconds = r.currentTime
            r.stop(); self.recorder = nil; self.state = "idle"; self.clearReminder()
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
            let dur = AVURLAsset(url: url).duration.seconds
            self.emit()
            call.resolve(["path": url.absoluteString, "duration": dur.isFinite && dur > 0 ? dur : seconds, "mimeType": "audio/mp4"])
        }
    }
    @objc func discard(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.recorder?.stop(); self.recorder = nil; self.state = "idle"; self.clearReminder()
            if let p = call.getString("path"), let u = URL(string: p) { try? FileManager.default.removeItem(at: u) }
            else if let u = self.fileURL { try? FileManager.default.removeItem(at: u) }
            self.fileURL = nil; call.resolve()
        }
    }
    @objc func status(_ call: CAPPluginCall) { DispatchQueue.main.async { call.resolve(self.info()) } }

    private func info() -> [String: Any] {
        var level = 0.0
        if let r = recorder, r.isRecording { r.updateMeters(); level = Double(max(0, min(1, (r.averagePower(forChannel: 0) + 50) / 50))) }
        return ["state": state, "seconds": recorder?.currentTime ?? 0, "level": level, "path": fileURL?.absoluteString ?? ""]
    }
    private func emit() { notifyListeners("state", data: info()) }

    private func interrupted(_ n: Notification) {
        guard let raw = n.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt, let type = AVAudioSession.InterruptionType(rawValue: raw), recorder != nil else { return }
        if type == .began {
            if state == "recording" { state = "interrupted"; emit(); remindLater() }
        } else {
            resumeIfNeeded()   // call declined, missed or ended → keep going
        }
    }
    private func resumeIfNeeded() {
        guard let r = recorder, !userPaused, state != "idle" else { return }
        do { try session() } catch { return }
        if r.isRecording || r.record() { state = "recording"; clearReminder(); emit() }
    }
    // If iOS keeps the app asleep after a long call, a gentle reminder brings the person back to continue.
    private func remindLater() {
        let c = UNMutableNotificationContent(); c.title = noteTitle; c.body = noteBody
        let req = UNNotificationRequest(identifier: reminderId, content: c, trigger: UNTimeIntervalNotificationTrigger(timeInterval: 90, repeats: false))
        UNUserNotificationCenter.current().add(req)
    }
    private func clearReminder() { UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [reminderId]) }

    public func audioRecorderEncodeErrorDidOccur(_ recorder: AVAudioRecorder, error: Error?) { state = "idle"; notifyListeners("error", data: ["message": error?.localizedDescription ?? "encode_error"]) }
}
