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

    static let mockVenues: [Venue] = [
        mock,
        Venue(
            id: UUID(),
            name: "ONYX",
            area: "Brooklyn, NY",
            vibe: "Warehouse Club",
            rating: 4.6,
            reviewCount: 218,
            openUntil: "5:00 AM",
            minSpend: 300,
            tags: ["Electronic", "Rooftop", "Open Bar"],
            promoText: "Open bar until 11 PM",
            tables: [
                VenueTable(id: UUID(), label: "VIP A", type: .vip, price: 800, capacity: 8, isAvailable: true, promoText: nil, minBottles: 2, dressCode: "Casual", arrivalDeadline: "11PM", layoutX: 80, layoutY: 100, layoutWidth: 90, layoutHeight: 60),
                VenueTable(id: UUID(), label: "VIP B", type: .vip, price: 1000, capacity: 10, isAvailable: false, promoText: nil, minBottles: 2, dressCode: "Casual", arrivalDeadline: "10:30PM", layoutX: 260, layoutY: 100, layoutWidth: 90, layoutHeight: 60),
                VenueTable(id: UUID(), label: "Booth 1", type: .booth, price: 350, capacity: 5, isAvailable: true, promoText: "2 for 1 shots", minBottles: 1, dressCode: "Casual", arrivalDeadline: "Midnight", layoutX: 80, layoutY: 220, layoutWidth: 75, layoutHeight: 55),
            ],
            accentColorHex: "#7C3AED"
        ),
        Venue(
            id: UUID(),
            name: "AZUL",
            area: "Miami Beach, FL",
            vibe: "Rooftop Bar",
            rating: 4.9,
            reviewCount: 489,
            openUntil: "3:00 AM",
            minSpend: 400,
            tags: ["Rooftop", "Cocktails", "Ocean View"],
            promoText: nil,
            tables: [
                VenueTable(id: UUID(), label: "Sky 1", type: .premium, price: 600, capacity: 6, isAvailable: true, promoText: nil, minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "10PM", layoutX: 80, layoutY: 100, layoutWidth: 90, layoutHeight: 60),
                VenueTable(id: UUID(), label: "Sky 2", type: .premium, price: 600, capacity: 6, isAvailable: true, promoText: nil, minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "10PM", layoutX: 260, layoutY: 100, layoutWidth: 90, layoutHeight: 60),
                VenueTable(id: UUID(), label: "Bar 1", type: .bar, price: 150, capacity: 3, isAvailable: true, promoText: nil, minBottles: 1, dressCode: "Casual", arrivalDeadline: "Midnight", layoutX: 160, layoutY: 340, layoutWidth: 60, layoutHeight: 45),
            ],
            accentColorHex: "#0891B2"
        ),
        Venue(
            id: UUID(),
            name: "VERDE",
            area: "Los Angeles, CA",
            vibe: "Jungle Lounge",
            rating: 4.7,
            reviewCount: 175,
            openUntil: "2:00 AM",
            minSpend: 250,
            tags: ["Lounge", "Live Music", "Craft Cocktails"],
            promoText: "Happy hour until 9 PM",
            tables: [
                VenueTable(id: UUID(), label: "Garden 1", type: .booth, price: 400, capacity: 5, isAvailable: true, promoText: "Happy hour deal", minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "9PM", layoutX: 80, layoutY: 220, layoutWidth: 75, layoutHeight: 55),
                VenueTable(id: UUID(), label: "Garden 2", type: .booth, price: 400, capacity: 5, isAvailable: false, promoText: nil, minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "9PM", layoutX: 190, layoutY: 220, layoutWidth: 75, layoutHeight: 55),
                VenueTable(id: UUID(), label: "Stage Left", type: .premium, price: 700, capacity: 8, isAvailable: true, promoText: nil, minBottles: 2, dressCode: "Smart casual", arrivalDeadline: "8:30PM", layoutX: 80, layoutY: 100, layoutWidth: 90, layoutHeight: 60),
            ],
            accentColorHex: "#059669"
        ),
    ]
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

    // Layout coordinates use a 460×440 reference canvas (matches the web dashboard).
    // BlueprintView scales these to fit the device screen at runtime.
    static let mockTables: [VenueTable] = [
        VenueTable(id: UUID(), label: "VIP 1",     type: .vip,     price: 1200, capacity: 8,  isAvailable: true,  promoText: "4 ppl in free",  minBottles: 2, dressCode: "No sneakers",  arrivalDeadline: "11PM",    layoutX: 80,  layoutY: 100, layoutWidth: 90, layoutHeight: 60),
        VenueTable(id: UUID(), label: "VIP 2",     type: .vip,     price: 1500, capacity: 10, isAvailable: false, promoText: nil,               minBottles: 3, dressCode: "No sneakers",  arrivalDeadline: "10:30PM", layoutX: 260, layoutY: 100, layoutWidth: 90, layoutHeight: 60),
        VenueTable(id: UUID(), label: "Section A", type: .premium, price: 600,  capacity: 6,  isAvailable: true,  promoText: "2 for 1 mixers",  minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "11:30PM", layoutX: 80,  layoutY: 220, layoutWidth: 75, layoutHeight: 55),
        VenueTable(id: UUID(), label: "Section B", type: .premium, price: 600,  capacity: 6,  isAvailable: true,  promoText: nil,               minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "11:30PM", layoutX: 190, layoutY: 220, layoutWidth: 75, layoutHeight: 55),
        VenueTable(id: UUID(), label: "Section C", type: .premium, price: 750,  capacity: 6,  isAvailable: false, promoText: nil,               minBottles: 2, dressCode: "Smart casual", arrivalDeadline: "11PM",    layoutX: 300, layoutY: 220, layoutWidth: 75, layoutHeight: 55),
        VenueTable(id: UUID(), label: "Bar 1",     type: .bar,     price: 200,  capacity: 4,  isAvailable: true,  promoText: nil,               minBottles: 1, dressCode: "Casual",       arrivalDeadline: "Midnight", layoutX: 80,  layoutY: 340, layoutWidth: 60, layoutHeight: 45),
        VenueTable(id: UUID(), label: "Bar 2",     type: .bar,     price: 200,  capacity: 4,  isAvailable: true,  promoText: nil,               minBottles: 1, dressCode: "Casual",       arrivalDeadline: "Midnight", layoutX: 160, layoutY: 340, layoutWidth: 60, layoutHeight: 45),
        VenueTable(id: UUID(), label: "Booth 1",   type: .booth,   price: 400,  capacity: 5,  isAvailable: true,  promoText: "4 ppl in free",  minBottles: 1, dressCode: "Smart casual", arrivalDeadline: "11PM",    layoutX: 270, layoutY: 330, layoutWidth: 70, layoutHeight: 50),
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

    static let mockBookings: [Booking] = [
        Booking(id: UUID(), venueName: "NOIR", tableLabel: "VIP 1",     date: "SAT, MAR 8",  partySize: 6,  minimumSpend: 1200, confirmationCode: "NL-48201", status: .confirmed, createdAt: Date()),
        Booking(id: UUID(), venueName: "NOIR", tableLabel: "Section A", date: "SAT, MAR 8",  partySize: 4,  minimumSpend: 600,  confirmationCode: "NL-48202", status: .confirmed, createdAt: Date()),
        Booking(id: UUID(), venueName: "ONYX", tableLabel: "Booth 1",   date: "SUN, MAR 9",  partySize: 5,  minimumSpend: 350,  confirmationCode: "NL-48203", status: .pending,   createdAt: Date()),
        Booking(id: UUID(), venueName: "AZUL", tableLabel: "Sky 1",     date: "FRI, MAR 14", partySize: 3,  minimumSpend: 600,  confirmationCode: "NL-48204", status: .confirmed, createdAt: Date()),
    ]
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
