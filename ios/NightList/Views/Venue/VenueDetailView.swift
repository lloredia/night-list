import SwiftUI

struct VenueDetailView: View {
    let venue: Venue
    var selectedDate: String = "SAT, MAR 8"
    @Environment(\.dismiss) var dismiss

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {

                    // Hero
                    ZStack(alignment: .bottom) {
                        LinearGradient(colors: [Color(hex: "#1a1410"), Color(hex: "#0d0a05")],
                                       startPoint: .topLeading, endPoint: .bottomTrailing)
                        .frame(height: 220)

                        Text("🖤").font(.system(size: 90))

                        LinearGradient(colors: [.clear, .black], startPoint: .top, endPoint: .bottom)
                            .frame(height: 100)
                            .frame(maxWidth: .infinity)
                    }
                    .frame(height: 220)

                    VStack(alignment: .leading, spacing: 0) {

                        // Title Row
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(venue.name)
                                    .font(.system(size: 32, weight: .black))
                                    .foregroundStyle(.white)
                                    .tracking(3)
                                Text("\(venue.area) · \(venue.vibe)")
                                    .foregroundStyle(Color(white: 0.35))
                                    .font(.subheadline)
                            }
                            Spacer()
                            VStack(spacing: 4) {
                                Text("★ \(venue.rating, specifier: "%.1f")")
                                    .foregroundStyle(.yellow)
                                    .font(.subheadline.bold())
                                Text("\(venue.reviewCount) reviews")
                                    .foregroundStyle(Color(white: 0.25))
                                    .font(.caption)
                            }
                            .padding(10)
                            .background(Color(white: 0.07))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 20)

                        // Stats Row
                        HStack(spacing: 10) {
                            StatCard(icon: "🕐", label: "Closes", value: venue.openUntil)
                            StatCard(icon: "💰", label: "Min Spend", value: "$\(venue.minSpend)")
                            StatCard(icon: "🪑", label: "Tables", value: "\(venue.tables.count) total")
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 16)

                        // Promo Banner
                        if let promo = venue.promoText {
                            HStack(spacing: 12) {
                                Text("🎁").font(.title2)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Tonight's Promo")
                                        .font(.caption.bold())
                                        .foregroundStyle(Color(hex: venue.accentColorHex))
                                    Text(promo)
                                        .foregroundStyle(Color(white: 0.8))
                                        .font(.subheadline)
                                }
                            }
                            .padding(14)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color(hex: venue.accentColorHex).opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: venue.accentColorHex).opacity(0.3)))
                            .padding(.horizontal, 20)
                            .padding(.top, 16)
                        }

                        // Tags
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(venue.tags, id: \.self) { tag in
                                    Text(tag)
                                        .font(.caption.bold())
                                        .foregroundStyle(Color(white: 0.5))
                                        .padding(.horizontal, 12).padding(.vertical, 6)
                                        .background(Color(white: 0.07))
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(white: 0.13)))
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        .padding(.top, 14)

                        // CTA
                        NavigationLink(destination: BlueprintView(venue: venue, selectedDate: selectedDate)) {
                            Text("View Floor Plan & Reserve")
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
                        .padding(.top, 24)
                        .padding(.bottom, 40)
                    }
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button(action: { dismiss() }) {
                    Image(systemName: "chevron.left")
                        .foregroundStyle(.white)
                        .padding(8)
                        .background(Color(white: 0.1))
                        .clipShape(Circle())
                }
            }
        }
    }
}

struct StatCard: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 6) {
            Text(icon).font(.title2)
            Text(value).font(.subheadline.bold()).foregroundStyle(.white)
            Text(label).font(.system(size: 9)).foregroundStyle(Color(white: 0.25)).textCase(.uppercase).tracking(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Color(white: 0.05))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.08)))
    }
}

#Preview {
    NavigationStack { VenueDetailView(venue: .mock) }
}
