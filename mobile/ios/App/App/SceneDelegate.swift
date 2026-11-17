import UIKit
import Capacitor
import WidgetKit

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
    }
}

/// WidgetBridge: the web app hands today's verse / thanks / passage to the home-screen widgets
/// (App Group "group.org.dailyjourney.dailythanks"), then asks WidgetKit to redraw them.
@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise)]
    @objc func update(_ call: CAPPluginCall) {
        UserDefaults(suiteName: "group.org.dailyjourney.dailythanks")?.set(call.getString("json") ?? "{}", forKey: "widget")
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
