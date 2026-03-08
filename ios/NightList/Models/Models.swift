import Foundation
import SwiftUI

// MARK: - Venue
struct Venue: Identifiable, Codable {
    let id: UUID
    var name: String
    var area: String
    var vibe: String
    var rating: Double
    var reviewCount: Int
    var openUntil: String
    var minSpend: Int
    var tags: [String]
    var promoText: String?
    var tables: [VenueTable]
    var accentColorHex: String

    static let mock = Venue(
        id: UUID(),
        name: "NOIR",
        area: "Manhattan, NY",
        vibe: "Upscale Lounge",
        rating: 4.8,
        reviewCount: 312,
        openUntil: "4:00 AM",
        minSpend: 500,
        tags: ["VIP", "Bottle Service", "DJ"],
        promoText: "Ladies free before midnight",
        tables: VenueTable.mockTables,
        accentColorHex: "#C9A84C"
    )
}

// MARK: - Table
struct VenueTable: Identifiable, Codable {
    let id: UUID
    var label: String
    var type: TableType
    var price: Int
    var capacity: Int
    var isAvailable: Bool
    var promoText: String?
    var minBottles: Int
    var dressCode: String
    var arrivalDeadline: String

    // Blueprint layout
    var layoutX: CGFloat
    var layoutY: CGFloat
    var layoutWidth: CGFloat
    var layoutHeight: CGFloat

    enum TableType: String, Codable, CaseIterable {
        case vip, premium, bar, booth

        var color: Color {
            switch self {
            case .vip:     return Color(hex: "#C9A84C")
            case .premium: return Color(hex: "#7C3AED")
            case .bar:     return Color(hex: "#0891B2")
            case .booth:   return Color(hex: "#059669")
            }
        }

        var label: String { rawValue.capitalized }
    }

    static let mockTables: [VenueTable] = [
        VenueTable(id: UUID(), label: "VIP 1", type: .vip, price: 1200, capacity: 8, isAvailable: true, promoText: "4 ppl in free", minBottles: 2, dressCode: "No sneakers", arrivalDeadline: "11PM", layoutX: 60, layoutY: 80, layoutWidth: 70, layoutHeight: 50),
        VenueTable(id: UUID(), label: "VIP 2", type: .vip, price: 1500, capacity: 10, isAvailable: false, promoText: nil, minBottles: 3, dressCode: "No sneakers", arrivalDeadline: "10:30PM", layoutX: 200, layoutY: 80, layoutWidth: 70, layoutHeight: 50),
        VenueTable(id: UUID(), label: "Section A", type: .premium, price: 600, capacity: 6, isAvailable: true, promoText: "2 for 1 mixers", minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "11:30PM", layoutX: 60, layoutY: 180, layoutWidth: 55, layoutHeight: 45),
        VenueTable(id: UUID(), label: "Booth 1", type: .booth, price: 400, capacity: 5, isAvailable: true, promoText: "4 ppl in free", minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "11PM", layoutX: 200, layoutY: 260, layoutWidth: 50, layoutHeight: 40),
    ]
}

// MARK: - Booking
struct Booking: Identifiable, Codable {
    let id: UUID
    var venueName: String
    var tableLabel: String
    var date: String
    var partySize: Int
    var minimumSpend: Int
    var confirmationCode: String
    var status: BookingStatus
    var createdAt: Date

    enum BookingStatus: String, Codable {
        case confirmed, pending, cancelled
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8) & 0xFF) / 255
        let b = Double(int & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
