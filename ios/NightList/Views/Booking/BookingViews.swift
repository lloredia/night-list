import SwiftUI

// MARK: - Booking Confirm

struct BookingConfirmView: View {
    let table: VenueTable
    let venue: Venue
    @Environment(\.dismiss) var dismiss
    @State private var partySize: Int = 2
    @State private var navigateToSuccess = false
    @State private var confirmationCode = ""

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {

                        // ── Header ──────────────────────────────────
                        VStack(spacing: 6) {
                            Text(table.label)
                                .font(.system(size: 26, weight: .bold))
                                .foregroundStyle(.white)
                            Text(table.type.label + " · " + venue.name)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(table.type.color)
                        }
                        .padding(.top, 8)

                        // ── Summary Card ─────────────────────────────
                        VStack(spacing: 0) {
                            SummaryRow(title: "Minimum Spend", value: "$\(table.price)")
                            Divider().background(Color.white.opacity(0.06))
                            SummaryRow(title: "Capacity", value: "Up to \(table.capacity) guests")
                            Divider().background(Color.white.opacity(0.06))
                            SummaryRow(title: "Min. Bottles", value: "\(table.minBottles)")
                            Divider().background(Color.white.opacity(0.06))
                            SummaryRow(title: "Dress Code", value: table.dressCode)
                            Divider().background(Color.white.opacity(0.06))
                            SummaryRow(title: "Arrive By", value: table.arrivalDeadline)
                            if let promo = table.promoText {
                                Divider().background(Color.white.opacity(0.06))
                                SummaryRow(title: "Promo", value: promo, valueColor: Color(hex: "#C9A84C"))
                            }
                        }
                        .background(Color.white.opacity(0.04))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.white.opacity(0.08), lineWidth: 1))

                        // ── Party Size ───────────────────────────────
                        VStack(alignment: .leading, spacing: 12) {
                            Text("PARTY SIZE")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundStyle(.white.opacity(0.4))
                                .tracking(1)

                            HStack {
                                Button(action: { if partySize > 1 { partySize -= 1 } }) {
                                    Image(systemName: "minus")
                                        .font(.system(size: 16, weight: .semibold))
                                        .frame(width: 40, height: 40)
                                        .background(Color.white.opacity(0.07))
                                        .clipShape(Circle())
                                        .foregroundStyle(.white)
                                }

                                Spacer()
                                Text("\(partySize)")
                                    .font(.system(size: 28, weight: .bold))
                                    .foregroundStyle(.white)
                                Spacer()

                                Button(action: { if partySize < table.capacity { partySize += 1 } }) {
                                    Image(systemName: "plus")
                                        .font(.system(size: 16, weight: .semibold))
                                        .frame(width: 40, height: 40)
                                        .background(Color.white.opacity(0.07))
                                        .clipShape(Circle())
                                        .foregroundStyle(.white)
                                }
                            }

                            // Capacity bar
                            GeometryReader { geo in
                                ZStack(alignment: .leading) {
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(Color.white.opacity(0.08))
                                        .frame(height: 6)
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(table.type.color)
                                        .frame(width: geo.size.width * CGFloat(partySize) / CGFloat(table.capacity), height: 6)
                                        .animation(.spring(response: 0.3), value: partySize)
                                }
                            }
                            .frame(height: 6)

                            Text("\(partySize) of \(table.capacity) capacity")
                                .font(.system(size: 11))
                                .foregroundStyle(.white.opacity(0.35))
                        }
                        .padding(16)
                        .background(Color.white.opacity(0.04))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.white.opacity(0.08), lineWidth: 1))

                        // ── Payment Note ─────────────────────────────
                        HStack(spacing: 10) {
                            Image(systemName: "creditcard")
                                .font(.system(size: 13))
                                .foregroundStyle(Color(hex: "#C9A84C"))
                            Text("Card charged at venue. Cancellation up to 24 hrs before.")
                                .font(.system(size: 12))
                                .foregroundStyle(.white.opacity(0.4))
                        }
                        .padding(.horizontal, 4)

                        // ── CTA ──────────────────────────────────────
                        Button(action: confirm) {
                            Text("Confirm Reservation")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundStyle(.black)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(Color(hex: venue.accentColorHex))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                .shadow(color: Color(hex: venue.accentColorHex).opacity(0.4), radius: 12, y: 4)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 32)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.white.opacity(0.6))
                    }
                }
            }
            .navigationDestination(isPresented: $navigateToSuccess) {
                BookingSuccessView(
                    table: table,
                    venue: venue,
                    partySize: partySize,
                    confirmationCode: confirmationCode
                )
            }
        }
    }

    private func confirm() {
        confirmationCode = "NL-\(Int.random(in: 10000...99999))"
        navigateToSuccess = true
    }
}

// MARK: - Summary Row

private struct SummaryRow: View {
    let title: String
    let value: String
    var valueColor: Color = .white

    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(.white.opacity(0.45))
            Spacer()
            Text(value)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(valueColor)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

// MARK: - Booking Success

struct BookingSuccessView: View {
    let table: VenueTable
    let venue: Venue
    let partySize: Int
    let confirmationCode: String
    @Environment(\.dismiss) var dismiss
    @State private var animateIn = false

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                // Check + glow
                ZStack {
                    Circle()
                        .fill(Color(hex: "#C9A84C").opacity(animateIn ? 0.15 : 0))
                        .frame(width: 120, height: 120)
                        .blur(radius: 20)
                    Circle()
                        .fill(Color(hex: "#C9A84C").opacity(0.12))
                        .frame(width: 80, height: 80)
                    Image(systemName: "checkmark")
                        .font(.system(size: 30, weight: .bold))
                        .foregroundStyle(Color(hex: "#C9A84C"))
                }
                .scaleEffect(animateIn ? 1.0 : 0.5)
                .opacity(animateIn ? 1.0 : 0)
                .animation(.spring(response: 0.5, dampingFraction: 0.65), value: animateIn)

                VStack(spacing: 8) {
                    Text("You're on the list")
                        .font(.system(size: 26, weight: .bold))
                        .foregroundStyle(.white)
                    Text("See you at \(venue.name)")
                        .font(.system(size: 14))
                        .foregroundStyle(.white.opacity(0.45))
                }
                .padding(.top, 24)
                .opacity(animateIn ? 1.0 : 0)
                .animation(.easeOut(duration: 0.4).delay(0.2), value: animateIn)

                // Confirmation card
                VStack(spacing: 16) {
                    VStack(spacing: 12) {
                        ConfirmationRow(icon: "ticket", label: "Confirmation", value: confirmationCode)
                        Divider().background(Color.white.opacity(0.06))
                        ConfirmationRow(icon: "person.2", label: "Party", value: "\(partySize) guests")
                        Divider().background(Color.white.opacity(0.06))
                        ConfirmationRow(icon: "chair.lounge", label: "Table", value: table.label)
                        Divider().background(Color.white.opacity(0.06))
                        ConfirmationRow(icon: "clock", label: "Arrive By", value: table.arrivalDeadline)
                        Divider().background(Color.white.opacity(0.06))
                        ConfirmationRow(icon: "dollarsign.circle", label: "Min. Spend", value: "$\(table.price)")
                    }
                    .padding(16)
                    .background(Color.white.opacity(0.04))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.white.opacity(0.08), lineWidth: 1))
                }
                .padding(.horizontal, 24)
                .padding(.top, 32)
                .opacity(animateIn ? 1.0 : 0)
                .animation(.easeOut(duration: 0.4).delay(0.35), value: animateIn)

                Spacer()

                Button(action: { dismiss() }) {
                    Text("Done")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color(hex: "#C9A84C"))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .shadow(color: Color(hex: "#C9A84C").opacity(0.35), radius: 10, y: 4)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
                .opacity(animateIn ? 1.0 : 0)
                .animation(.easeOut(duration: 0.3).delay(0.5), value: animateIn)
            }
        }
        .navigationBarHidden(true)
        .onAppear { animateIn = true }
    }
}

// MARK: - Confirmation Row

private struct ConfirmationRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 13))
                .foregroundStyle(Color(hex: "#C9A84C").opacity(0.8))
                .frame(width: 20)
            Text(label)
                .font(.system(size: 13))
                .foregroundStyle(.white.opacity(0.45))
            Spacer()
            Text(value)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white)
        }
    }
}

#Preview {
    BookingConfirmView(table: VenueTable.mockTables[0], venue: .mock)
}
