// Home-screen widgets for iOS (WidgetKit). Add them in Xcode: File › New › Target › Widget Extension
// named "DailyThanksWidget", then replace the generated Swift file with this one (see mobile/README_KO.md).
//   • "오늘의 말씀"  — a verse about thanks, new each day (small / medium / large). Follows light and dark mode.
//   • "오늘의 감사" — your thanks today (or today's question), the streak, a write button.
//   • "오늘의 묵상" — today's passage (생명의 삶 when available) and a reflect button.
//   • "감사 쓰기"   — today's question and a write button.
// The app writes today's data to the App Group "group.org.dailyjourney.dailythanks" (WidgetBridge, SceneDelegate.swift);
// turn on App Groups with that name for both the App target and this widget target (Signing & Capabilities).
// Tapping either opens the app's writing sheet (daily-thanks://write).
import WidgetKit
import SwiftUI

struct Entry: TimelineEntry { let date: Date }

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> Entry { Entry(date: .now) }
    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) { completion(Entry(date: .now)) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        // a new verse every day: refresh just after midnight
        let tomorrow = Calendar.current.startOfDay(for: .now.addingTimeInterval(86_400))
        completion(Timeline(entries: [Entry(date: .now)], policy: .after(tomorrow)))
    }
}

private var langIndex: Int {
    switch Locale.preferredLanguages.first?.prefix(2) { case "ko": return 0; case "es": return 2; default: return 1 }
}
private func t(_ ko: String, _ en: String, _ es: String) -> String { [ko, en, es][langIndex] }

// Verses about thanks (개역한글 / KJV / Reina-Valera 1909 — public domain). Same list and order as the app.
struct V { let ref: [String]; let text: [String] }
private let verses: [V] = [
    V(ref: ["고린도후서 9:15", "2 Corinthians 9:15", "2 Corintios 9:15"],
      text: ["말할 수 없는 그의 은사를 인하여 하나님께 감사하노라", "Thanks be unto God for his unspeakable gift.", "Gracias á Dios por su don inefable."]),
    V(ref: ["시편 9:1", "Psalm 9:1", "Salmos 9:1"],
      text: ["내가 전심으로 여호와께 감사하오며 주의 모든 기사를 전하리이다", "I will praise thee, O Lord, with my whole heart; I will shew forth all thy marvellous works.", "Te alabaré, oh Jehová, con todo mi corazón; contaré todas tus maravillas."]),
    V(ref: ["에베소서 5:20", "Ephesians 5:20", "Efesios 5:20"],
      text: ["범사에 우리 주 예수 그리스도의 이름으로 항상 아버지 하나님께 감사하며", "Giving thanks always for all things unto God and the Father in the name of our Lord Jesus Christ;", "Dando gracias siempre de todo al Dios y Padre en el nombre de nuestro Señor Jesucristo:"]),
    V(ref: ["시편 107:1", "Psalm 107:1", "Salmos 107:1"],
      text: ["여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다", "O give thanks unto the Lord, for he is good: for his mercy endureth for ever.", "Alabad á Jehová, porque es bueno; porque para siempre es su misericordia."]),
    V(ref: ["데살로니가전서 5:16-18", "1 Thessalonians 5:16-18", "1 Tesalonicenses 5:16-18"],
      text: ["항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이는 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", "Estad siempre gozosos. Orad sin cesar. Dad gracias en todo; porque esta es la voluntad de Dios para con vosotros en Cristo Jesús."]),
    V(ref: ["시편 118:24", "Psalm 118:24", "Salmos 118:24"],
      text: ["이 날은 여호와의 정하신 것이라 이 날에 우리가 즐거워하고 기뻐하리로다", "This is the day which the Lord hath made; we will rejoice and be glad in it.", "Este es el día que hizo Jehová: nos gozaremos y alegraremos en él."]),
    V(ref: ["빌립보서 4:6", "Philippians 4:6", "Filipenses 4:6"],
      text: ["아무 것도 염려하지 말고 오직 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", "Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego, con hacimiento de gracias."]),
    V(ref: ["예레미야애가 3:22-23", "Lamentations 3:22-23", "Lamentaciones 3:22-23"],
      text: ["여호와의 자비와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것이 아침마다 새로우니 주의 성실이 크도소이다", "It is of the Lord’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", "Es por la misericordia de Jehová que no somos consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad."]),
    V(ref: ["시편 100:4", "Psalm 100:4", "Salmos 100:4"],
      text: ["감사함으로 그 문에 들어가며 찬송함으로 그 궁정에 들어가서 그에게 감사하며 그 이름을 송축할지어다", "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.", "Entrad por sus puertas con reconocimiento, por sus atrios con alabanza: alabadle, bendecid su nombre."]),
    V(ref: ["골로새서 3:15", "Colossians 3:15", "Colosenses 3:15"],
      text: ["그리스도의 평강이 너희 마음을 주장하게 하라 평강을 위하여 너희가 한 몸으로 부르심을 받았나니 또한 너희는 감사하는 자가 되라", "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.", "Y la paz de Dios gobierne en vuestros corazones, á la cual asimismo sois llamados en un cuerpo; y sed agradecidos."]),
    V(ref: ["시편 103:2", "Psalm 103:2", "Salmos 103:2"],
      text: ["내 영혼아 여호와를 송축하며 그 모든 은택을 잊지 말지어다", "Bless the Lord, O my soul, and forget not all his benefits:", "Bendice, alma mía á Jehová, y no olvides ninguno de sus beneficios."]),
    V(ref: ["야고보서 1:17", "James 1:17", "Santiago 1:17"],
      text: ["각양 좋은 은사와 온전한 선물이 다 위로부터 빛들의 아버지께로서 내려오나니 그는 변함도 없으시고 회전하는 그림자도 없으시니라", "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.", "Toda buena dádiva y todo don perfecto es de lo alto, que desciende del Padre de las luces, en el cual no hay mudanza, ni sombra de variación."])
]
private func verse(for date: Date) -> (ref: String, text: String, tr: String) {
    let day = Calendar.current.ordinality(of: .day, in: .year, for: date) ?? 1
    let v = verses[(day - 1) % verses.count]
    return (v.ref[langIndex], v.text[langIndex], ["개역한글", "KJV", "RV 1909"][langIndex])
}

// the soft light (the app's mark): warm core fading out
struct Light: View {
    var size: CGFloat = 26
    var body: some View {
        Circle().fill(RadialGradient(colors: [Color(red: 0.965, green: 0.843, blue: 0.478),
                                              Color(red: 0.984, green: 0.906, blue: 0.651).opacity(0.5),
                                              Color(red: 0.984, green: 0.906, blue: 0.651).opacity(0)],
                                     center: .center, startRadius: 1, endRadius: size / 2))
            .frame(width: size, height: size)
    }
}

struct VerseView: View {
    var entry: Entry
    @Environment(\.widgetFamily) var family
    @Environment(\.colorScheme) var scheme
    var ink: Color { scheme == .dark ? .white : Color(red: 0.19, green: 0.20, blue: 0.22) }
    var faint: Color { scheme == .dark ? Color(white: 0.62) : Color(red: 0.60, green: 0.62, blue: 0.64) }
    var label: some View {
        Text(t("오늘의 말씀", "DAILY VERSE", "VERSÍCULO DEL DÍA"))
            .font(.system(size: 11, weight: .semibold)).tracking(langIndex == 0 ? 0.5 : 2).foregroundColor(faint)
    }
    var body: some View {
        let v = verse(for: entry.date)
        Group {
            if family == .systemSmall {
                VStack(alignment: .leading, spacing: 0) {
                    label
                    Spacer(minLength: 6)
                    Text(v.text).font(.system(size: 14, weight: .semibold)).foregroundColor(ink).lineLimit(5).minimumScaleFactor(0.8)
                    Spacer(minLength: 6)
                    Text(v.ref).font(.system(size: 12, weight: .semibold)).foregroundColor(faint).lineLimit(1)
                }
            } else {
                VStack(alignment: .leading, spacing: 0) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 3) {
                            label
                            Text("\(v.ref) · \(v.tr)").font(.system(size: 16, weight: .bold)).foregroundColor(ink).lineLimit(1)
                        }
                        Spacer()
                        Light()
                    }
                    Rectangle().fill(faint.opacity(0.25)).frame(height: 1).padding(.top, 10)
                    Spacer(minLength: 8)
                    Text(v.text).font(.system(size: family == .systemLarge ? 22 : 15, weight: .semibold)).foregroundColor(ink)
                        .lineLimit(family == .systemLarge ? 8 : 3).minimumScaleFactor(0.8)
                    Spacer(minLength: 8)
                    HStack {
                        Text(v.tr).font(.system(size: 11, weight: .semibold)).foregroundColor(faint)
                            .padding(.horizontal, 8).padding(.vertical, 3)
                            .background(Capsule().fill(faint.opacity(0.18)))
                        Spacer()
                        (Text("daily ").font(.custom("Georgia", size: 13)) + Text("thanks").font(.custom("Georgia-Italic", size: 13)))
                            .foregroundColor(faint)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .containerBackground(for: .widget) { scheme == .dark ? Color(red: 0.16, green: 0.16, blue: 0.17) : Color.white }
        .widgetURL(URL(string: "daily-thanks://write"))
    }
}

struct WriteView: View {
    var entry: Entry
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Light(size: 30).padding(.leading, -4).padding(.top, -4)
            Spacer(minLength: 0)
            Text(t("오늘 감사한 것은?", "What are you thankful for today?", "¿Por qué estás agradecido hoy?"))
                .font(.system(size: 16, weight: .light))
                .foregroundColor(Color(red: 0.19, green: 0.20, blue: 0.22))
                .lineLimit(3)
            Spacer(minLength: 0)
            Text(t("+ 감사 쓰기", "+ Write", "+ Escribir"))
                .font(.system(size: 13))
                .foregroundColor(Color(red: 0.19, green: 0.20, blue: 0.22))
                .padding(.horizontal, 12).padding(.vertical, 6)
                .background(Capsule().fill(Color(white: 0.945)))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .containerBackground(.white, for: .widget)
        .widgetURL(URL(string: "daily-thanks://write"))
    }
}

// Today's data from the app (JSON written by the WidgetBridge plugin). Missing → friendly defaults.
struct Shared {
    let d: [String: Any]
    init() {
        let raw = UserDefaults(suiteName: "group.org.dailyjourney.dailythanks")?.string(forKey: "widget") ?? "{}"
        d = (try? JSONSerialization.jsonObject(with: Data(raw.utf8))) as? [String: Any] ?? [:]
    }
    func s(_ k: String) -> String { d[k] as? String ?? "" }
    func label(_ k: String, _ fallback: String) -> String { (d["labels"] as? [String: String])?[k] ?? fallback }
    var isToday: Bool { s("date") == { let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"; return f.string(from: .now) }() }
}

struct ThanksView: View {
    var entry: Entry
    @Environment(\.colorScheme) var scheme
    var body: some View {
        let x = Shared(), today = x.isToday, mine = today ? x.s("thanks") : ""
        let ink: Color = scheme == .dark ? .white : Color(red: 0.19, green: 0.20, blue: 0.22)
        let faint: Color = scheme == .dark ? Color(white: 0.62) : Color(red: 0.60, green: 0.62, blue: 0.64)
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text(x.label("thanks", t("오늘의 감사", "TODAY’S THANKS", "GRATITUD DE HOY"))).font(.system(size: 11, weight: .semibold)).foregroundColor(faint)
                Spacer()
                if !x.s("streakText").isEmpty { Text(x.s("streakText")).font(.system(size: 10)).foregroundColor(faint) }
            }
            Spacer(minLength: 6)
            Text(mine.isEmpty ? (x.s("question").isEmpty ? t("오늘 감사한 것은?", "What are you thankful for today?", "¿Por qué estás agradecido hoy?") : x.s("question")) : mine)
                .font(.system(size: 14, weight: mine.isEmpty ? .regular : .semibold)).foregroundColor(ink).lineLimit(4)
            Spacer(minLength: 6)
            Text(mine.isEmpty ? "+ " + x.label("write", t("감사 쓰기", "Write", "Escribir")) : "✓ " + x.label("done", t("오늘 감사 완료", "Done for today", "Listo por hoy")))
                .font(.system(size: 12)).foregroundColor(ink).padding(.horizontal, 10).padding(.vertical, 5)
                .background(Capsule().fill(faint.opacity(0.18)))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .containerBackground(for: .widget) { scheme == .dark ? Color(red: 0.16, green: 0.16, blue: 0.17) : Color.white }
        .widgetURL(URL(string: "daily-thanks://write"))
    }
}

struct MeditationView: View {
    var entry: Entry
    @Environment(\.colorScheme) var scheme
    var body: some View {
        let x = Shared(), today = x.isToday
        let ink: Color = scheme == .dark ? .white : Color(red: 0.19, green: 0.20, blue: 0.22)
        let faint: Color = scheme == .dark ? Color(white: 0.62) : Color(red: 0.60, green: 0.62, blue: 0.64)
        let source = x.s("passageSource")
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(x.label("med", t("오늘의 묵상", "TODAY’S REFLECTION", "REFLEXIÓN DE HOY")) + (source.isEmpty ? "" : " · \(source)"))
                        .font(.system(size: 11, weight: .semibold)).foregroundColor(faint)
                    Text(today ? x.s("passage") : t("오늘의 본문", "Today’s passage", "Pasaje de hoy")).font(.system(size: 16, weight: .bold)).foregroundColor(ink).lineLimit(1)
                }
                Spacer()
                Light()
            }
            Rectangle().fill(faint.opacity(0.25)).frame(height: 1).padding(.top, 10)
            Spacer(minLength: 6)
            Text(today ? x.s("passageText") : "").font(.system(size: 14)).foregroundColor(ink).lineLimit(3)
            Spacer(minLength: 6)
            Text(today && (x.d["meditated"] as? Bool ?? false) ? "✓ " + x.label("medDone", t("오늘 묵상 완료", "Reflected today", "Reflexión hecha")) : "✎ " + x.label("medWrite", t("묵상 쓰기", "Reflect", "Reflexionar")))
                .font(.system(size: 12)).foregroundColor(ink).padding(.horizontal, 10).padding(.vertical, 5)
                .background(Capsule().fill(faint.opacity(0.18)))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .containerBackground(for: .widget) { scheme == .dark ? Color(red: 0.16, green: 0.16, blue: 0.17) : Color.white }
        .widgetURL(URL(string: "daily-thanks://meditation"))
    }
}

struct ThanksTodayWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "DailyThanksToday", provider: Provider()) { ThanksView(entry: $0) }
            .configurationDisplayName(t("오늘의 감사", "Today’s Thanks", "Gratitud de hoy"))
            .description(t("오늘의 감사와 연속 기록", "Your thanks today and your streak", "Tu gratitud de hoy y tu racha"))
            .supportedFamilies([.systemSmall])
    }
}

struct MeditationWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "DailyThanksMeditation", provider: Provider()) { MeditationView(entry: $0) }
            .configurationDisplayName(t("오늘의 묵상", "Today’s Reflection", "Reflexión de hoy"))
            .description(t("오늘의 본문과 묵상 쓰기", "Today’s passage and a place to reflect", "El pasaje de hoy y un lugar para reflexionar"))
            .supportedFamilies([.systemMedium])
    }
}

struct VerseWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "DailyThanksVerse", provider: Provider()) { VerseView(entry: $0) }
            .configurationDisplayName(t("오늘의 말씀", "Daily Verse", "Versículo del día"))
            .description(t("매일 감사의 말씀 한 구절", "A verse about thanks, new each day", "Un versículo sobre la gratitud cada día"))
            .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct WriteWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "DailyThanksWidget", provider: Provider()) { WriteView(entry: $0) }
            .configurationDisplayName(t("감사 쓰기", "Write thanks", "Escribir gratitud"))
            .description(t("한 번에 오늘의 감사 쓰기", "Write today's thanks in one tap", "Escribe tu gratitud de hoy con un toque"))
            .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct DailyThanksWidgets: WidgetBundle {
    var body: some Widget {
        VerseWidget()
        ThanksTodayWidget()
        MeditationWidget()
        WriteWidget()
    }
}
