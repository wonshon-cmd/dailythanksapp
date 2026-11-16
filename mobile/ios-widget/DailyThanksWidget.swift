// Home-screen widget for iOS (WidgetKit). Add it in Xcode: File › New › Target › Widget Extension
// named "DailyThanksWidget", then replace the generated Swift file with this one (see mobile/README_KO.md).
import WidgetKit
import SwiftUI

struct Entry: TimelineEntry { let date: Date }

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> Entry { Entry(date: .now) }
    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) { completion(Entry(date: .now)) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        // The content is static; refresh once a day so the date-based question can change later.
        let tomorrow = Calendar.current.startOfDay(for: .now.addingTimeInterval(86_400))
        completion(Timeline(entries: [Entry(date: .now)], policy: .after(tomorrow)))
    }
}

private func t(_ ko: String, _ en: String, _ es: String) -> String {
    switch Locale.preferredLanguages.first?.prefix(2) {
    case "ko": return ko
    case "es": return es
    default: return en
    }
}

struct DailyThanksWidgetView: View {
    var entry: Entry
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // the soft light: warm core fading into white
            Circle()
                .fill(RadialGradient(colors: [Color(red: 0.965, green: 0.843, blue: 0.478),
                                              Color(red: 0.984, green: 0.906, blue: 0.651).opacity(0.5),
                                              Color.white.opacity(0)],
                                     center: .center, startRadius: 2, endRadius: 15))
                .frame(width: 30, height: 30)
                .padding(.leading, -4).padding(.top, -4)
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

@main
struct DailyThanksWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "DailyThanksWidget", provider: Provider()) { entry in
            DailyThanksWidgetView(entry: entry)
        }
        .configurationDisplayName("Daily Thanks")
        .description(t("한 번에 오늘의 감사 쓰기", "Write today's thanks in one tap", "Escribe tu gratitud de hoy con un toque"))
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
