import SwiftUI

// MARK: - Table Detail Sheet
struct TableDetailView: View {
    let table: VenueTable
    let venue: Venue
    @State private var partySize = 4
    @State private var showBookingConfirm = false
    @Environment(\.dismiss) var dismiss

    var body: some View {
        ZStack {
            Color(white: 0.04).ignoresSafeArea()

            ScrollView {
                VStack(spacing: 16) {

                    // Table Hero Card
                    VStack(spacing: 8) {
                        Text("🪑").font(.system(size: 48))
                        Text("$\(table.price.formatted())")
                            .font(.system(size: 36, weight: .black))
                            .foregroundStyle(table.type.color)
                        Text("Minimum Spend · \(table.capacity) guests max")
                            .font(.caption)
                            .foregroundStyle(Color(white: 0.35))

                        if let promo = table.promoText {
                            HStack(spacing: 8) {
                                Text("🎁")
                                Text(promo).font(.caption.bold()).foregroundStyle(Color(hex: "#C9A84C"))
                            }
                            .padding(.horizontal, 16).padding(.vertical, 8)
                            .background(Color(hex: "#C9A84C").opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "#C9A84C").opacity(0.3)))
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(24)
                    .background(Color(white: 0.06))
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(table.type.color.opacity(0.4)))
                    .shadow(color: table.type.color.opacity(0.15), radius: 20)

                    // Info Rows
                    VStack(spacing: 10) {
                        InfoRow(icon: "⏰", color: Color(hex: "#F59E0B"), label: "Arrive By", value: table.arrivalDeadline)
                        InfoRow(icon: "🍾", color: Color(hex: "#8B5CF6"), label: "Min Bottles", value: table.minBottles == 0 ? "No minimum" : "\(table.minBottles) bottle\(table.minBottles > 1 ? "s" : "")")
                        InfoRow(icon: "📋", color: Color(hex: "#EC4899"), label: "Dress Code", value: table.dressCode)
                        InfoRow(icon: "👥", color: Color(hex: "#10B981"), label: "Capacity", value: "Up to \(table.capacity) people")
                    }

                    // Party Size Picker
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Party Size")
                            .font(.caption.bold())
                            .foregroundStyle(Color(white: 0.35))
                            .tracking(1)
                            .textCase(.uppercase)

                        HStack {
                            Button(action: { if partySize > 1 { partySize -= 1 } }) {
                                Circle().fill(Color(white: 0.1)).frame(width: 36, height: 36)
                                    .overlay(Text("−").foregroundStyle(.white).font(.title2))
                            }
                            Spacer()
                            HStack(alignment: .bottom, spacing: 4) {
                                Text("\(partySize)").font(.system(size: 32, weight: .black)).foregroundStyle(.white)
                                Text("people").font(.subheadline).foregroundStyle(Color(white: 0.35)).padding(.bottom, 4)
                            }
                            Spacer()
                            Button(action: { if partySize < table.capacity { partySize += 1 } }) {
                                Circle().fill(Color(white: 0.1)).frame(width: 36, height: 36)
                                    .overlay(Text("+").foregroundStyle(.white).font(.title2))
                            }
                        }
                    }
                    .padding(16)
                    .background(Color(white: 0.06))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.1)))

                    // Reserve Button
                    Button(action: { showBookingConfirm = true }) {
                        Text("Reserve This Table")
                            .font(.subheadline.bold())
                            .tracking(1)
                            .textCase(.uppercase)
                            .foregroundStyle(.black)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(LinearGradient(colors: [Color(hex: venue.accentColorHex), Color(hex: venue.accentColorHex).opacity(0.8)], startPoint: .leading, endPoint: .trailing))
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                    .padding(.bottom, 20)
                }
                .padding(20)
            }
        }
        .navigationDestination(isPresented: $showBookingConfirm) {
            BookingConfirmView(table: table, venue: venue, partySize: partySize)
        }
    }
}

// MARK: - Info Row
struct InfoRow: View {
    let icon: String
    let color: Color
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 14) {
            RoundedRectangle(cornerRadius: 12)
                .fill(color.opacity(0.15))
                .frame(width: 40, height: 40)
                .overlay(Text(icon).font(.body))
            VStack(alignment: .leading, spacing: 2) {
                Text(label).font(.system(size: 10)).foregroundStyle(Color(white: 0.3)).tracking(1).textCase(.uppercase)
                Text(value).font(.subheadline.bold()).foregroundStyle(.white)
            }
            Spacer()
        }
        .padding(14)
        .background(Color(white: 0.05))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.08)))
    }
}

// MARK: - Booking Confirm
struct BookingConfirmView: View {
    let table: VenueTable
    let venue: Venue
    let partySize: Int
    @State private var showSuccess = false
    @Environment(\.dismiss) var dismiss

    let selectedDate = "SAT, MAR 8"

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {
                ScrollView {
                    VStack(spacing: 16) {

                        // Summary Card
                        VStack(spacing: 0) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(venue.name).font(.title2.weight(.black)).foregroundStyle(Color(hex: venue.accentColorHex)).tracking(3)
                                    Text(venue.area).foregroundStyle(Color(white: 0.4)).font(.subheadline)
                                }
                                Spacer()
                            }
                            .padding(20)
                            .background(LinearGradient(colors: [Color(hex: venue.accentColorHex).opacity(0.15), Color(white: 0.04)], startPoint: .topLeading, endPoint: .bottomTrailing))

                            Divider().background(Color(white: 0.1))

                            ForEach([
                                ("Table", table.label),
                                ("Date", selectedDate),
                                ("Party Size", "\(partySize) guests"),
                                ("Arrive By", table.arrivalDeadline),
                                ("Dress Code", table.dressCode)
                            ], id: \.0) { row in
                                HStack {
                                    Text(row.0).foregroundStyle(Color(white: 0.35)).font(.subheadline)
                                    Spacer()
                                    Text(row.1).foregroundStyle(.white).font(.subheadline.bold())
                                }
                                .padding(.horizontal, 20).padding(.vertical, 12)
                                Divider().background(Color(white: 0.07)).padding(.horizontal, 20)
                            }

                            HStack {
                                Text("Minimum Spend").foregroundStyle(.white).font(.subheadline.bold())
                                Spacer()
                                Text("$\(table.price.formatted())")
                                    .foregroundStyle(Color(hex: venue.accentColorHex))
                                    .font(.title3.bold())
                            }
                            .padding(20)
                        }
                        .background(Color(white: 0.04))
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(white: 0.1)))

                        // Payment Card
                        HStack(spacing: 12) {
                            RoundedRectangle(cornerRadius: 6).fill(Color(white: 0.1)).frame(width: 44, height: 30)
                                .overlay(Text("💳").font(.body))
                            VStack(alignment: .leading, spacing: 2) {
                                Text("•••• •••• •••• 4242").foregroundStyle(.white).font(.subheadline.bold())
                                Text("Visa · Expires 12/26").foregroundStyle(Color(white: 0.3)).font(.caption)
                            }
                            Spacer()
                            Text("✓ Saved").foregroundStyle(.green).font(.caption.bold())
                        }
                        .padding(16)
                        .background(Color(white: 0.04))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.1)))

                        // Note
                        Text("ℹ️ Card charged only at venue. Free cancellation up to 4 hours before.")
                            .font(.caption)
                            .foregroundStyle(.green)
                            .padding(14)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.green.opacity(0.07))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.green.opacity(0.2)))
                    }
                    .padding(20)
                }

                // CTA
                Button(action: { showSuccess = true }) {
                    Text("Confirm & Reserve 🎉")
                        .font(.subheadline.bold())
                        .tracking(1)
                        .textCase(.uppercase)
                        .foregroundStyle(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(LinearGradient(colors: [Color(hex: venue.accentColorHex), Color(hex: venue.accentColorHex).opacity(0.8)], startPoint: .leading, endPoint: .trailing))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 30)
            }
        }
        .navigationTitle("Confirm Reservation")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $showSuccess) {
            BookingSuccessView(venue: venue, table: table, partySize: partySize, date: selectedDate)
        }
    }
}

// MARK: - Booking Success
struct BookingSuccessView: View {
    let venue: Venue
    let table: VenueTable
    let partySize: Int
    let date: String
    let confirmCode = "NR" + String(Int.random(in: 100000...999999))

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 24) {
                Spacer()

                Text("🎉").font(.system(size: 72))
                    .scaleEffect(1)
                    .animation(.spring(response: 0.5, dampingFraction: 0.5), value: true)

                Text("You're In!").font(.system(size: 32, weight: .black)).foregroundStyle(.white)
                Text("Your reservation is confirmed").foregroundStyle(Color(white: 0.35)).font(.subheadline)

                VStack(spacing: 12) {
                    Text(venue.name).font(.title2.weight(.black)).foregroundStyle(Color(hex: venue.accentColorHex)).tracking(3)
                    Text("\(date) · \(partySize) guests").foregroundStyle(Color(white: 0.4)).font(.subheadline)

                    VStack(spacing: 4) {
                        Text("CONFIRMATION CODE")
                            .font(.system(size: 10)).foregroundStyle(Color(white: 0.3)).tracking(2)
                        Text(confirmCode)
                            .font(.system(size: 28, weight: .black)).foregroundStyle(.white).tracking(6)
                    }
                    .padding(16)
                    .frame(maxWidth: .infinity)
                    .background(Color(white: 0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .padding(24)
                .background(Color(white: 0.04))
                .clipShape(RoundedRectangle(cornerRadius: 20))
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(white: 0.1)))
                .padding(.horizontal, 20)

                Spacer()

                VStack(spacing: 12) {
                    NavigationLink(destination: MyBookingsView()) {
                        Text("View My Bookings")
                            .font(.subheadline.bold()).tracking(1).textCase(.uppercase).foregroundStyle(.black)
                            .frame(maxWidth: .infinity).padding(.vertical, 16)
                            .background(Color(hex: venue.accentColorHex))
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 30)
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}

#Preview {
    NavigationStack {
        TableDetailView(table: VenueTable.mockTables[0], venue: .mock)
    }
}
