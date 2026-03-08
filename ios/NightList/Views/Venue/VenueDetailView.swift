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
                        .frame(height: 200)

                        Image(systemName: "building.2.fill")
                            .font(.system(size: 56))
                            .foregroundStyle(Color(white: 0.12))

                        LinearGradient(colors: [.clear, .black], startPoint: .top, endPoint: .bottom)
                            .frame(height: 100)
                            .frame(maxWidth: .infinity)
                    }
                    .frame(height: 200)

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
                            VStack(spacing: 2) {
                                HStack(spacing: 4) {
                                    Image(systemName: "star.fill")
                                        .font(.caption2)
                                        .foregroundStyle(Color("Gold"))
                                    Text("\(venue.rating, specifier: "%.1f")")
                                        .font(.subheadline.weight(.semibold))
                                        .foregroundStyle(.white)
                                }
                                Text("\(venue.reviewCount) reviews")
                                    .font(.caption2)
                                    .foregroundStyle(Color(white: 0.35))
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 8)
                            .background(Color(white: 0.08))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 20)

                        // Stats Row
                        HStack(spacing: 10) {
                            StatCard(systemImage: "clock", label: "Closes", value: venue.openUntil)
                            StatCard(systemImage: "dollarsign", label: "Min", value: "$\(venue.minSpend)")
                            StatCard(systemImage: "table.furniture", label: "Tables", value: "\(venue.tables.count)")
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 16)

                        // Promo Banner
                        if let promo = venue.promoText {
                            HStack(spacing: 12) {
                                Image(systemName: "tag.fill")
                                    .font(.body)
                                    .foregroundStyle(Color(hex: venue.accentColorHex))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Promo")
                                        .font(.caption.weight(.semibold))
                                        .foregroundStyle(Color(hex: venue.accentColorHex))
                                    Text(promo)
                                        .font(.subheadline)
                                        .foregroundStyle(Color(white: 0.85))
                                }
                            }
                            .padding(12)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color(hex: venue.accentColorHex).opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: venue.accentColorHex).opacity(0.25), lineWidth: 1))
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
                            Text("View floor plan & reserve")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.black)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(hex: venue.accentColorHex))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
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
    let systemImage: String
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: systemImage)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(Color(white: 0.5))
            Text(value)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
            Text(label)
                .font(.system(size: 10))
                .foregroundStyle(Color(white: 0.4))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color(white: 0.06))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(white: 0.1), lineWidth: 1))
    }
}

#Preview {
    NavigationStack { VenueDetailView(venue: .mock) }
}
