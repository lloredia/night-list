import SwiftUI

struct DiscoverView: View {
    @State private var selectedDate = "SAT, MAR 8"
    @State private var searchText = ""

    let dates = ["FRI, MAR 7", "SAT, MAR 8", "SUN, MAR 9", "FRI, MAR 14"]
    let venues = [Venue.mock] // TODO: Replace with @StateObject VenueViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {

                        // Header
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Good Evening")
                                    .font(.caption)
                                    .foregroundStyle(.gray)
                                    .tracking(2)
                                    .textCase(.uppercase)
                                Text("Find Your Night 🌙")
                                    .font(.title2.bold())
                                    .foregroundStyle(.white)
                            }
                            Spacer()
                            Circle()
                                .fill(Color(white: 0.1))
                                .frame(width: 40, height: 40)
                                .overlay(Text("👤").font(.body))
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 8)

                        // Search Bar
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundStyle(.gray)
                            Text("Search venues, areas...")
                                .foregroundStyle(Color(white: 0.3))
                                .font(.subheadline)
                        }
                        .padding(14)
                        .background(Color(white: 0.07))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.13)))
                        .padding(.horizontal, 20)
                        .padding(.top, 16)

                        // Date Selector
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(dates, id: \.self) { date in
                                    Button(date) {
                                        selectedDate = date
                                    }
                                    .font(.caption.bold())
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 7)
                                    .background(selectedDate == date ? Color(hex: "#C9A84C") : Color(white: 0.08))
                                    .foregroundStyle(selectedDate == date ? .black : Color(white: 0.4))
                                    .clipShape(Capsule())
                                    .overlay(Capsule().stroke(Color(white: 0.13)).opacity(selectedDate == date ? 0 : 1))
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        .padding(.top, 12)

                        // Section Header
                        Text("Featured Tonight")
                            .font(.caption.bold())
                            .foregroundStyle(Color(white: 0.35))
                            .tracking(2)
                            .textCase(.uppercase)
                            .padding(.horizontal, 20)
                            .padding(.top, 20)
                            .padding(.bottom, 12)

                        // Venue Cards
                        ForEach(venues) { venue in
                            NavigationLink(destination: VenueDetailView(venue: venue, selectedDate: selectedDate)) {
                                VenueCard(venue: venue)
                            }
                            .buttonStyle(.plain)
                            .padding(.horizontal, 20)
                            .padding(.bottom, 16)
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
            .navigationBarHidden(true)
        }
    }
}

// MARK: - Venue Card
struct VenueCard: View {
    let venue: Venue

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Hero
            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: 0)
                    .fill(LinearGradient(colors: [Color(hex: "#1a1410"), Color(hex: "#0d0a05")], startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(height: 140)

                Text("🖤").font(.system(size: 64))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                if let promo = venue.promoText {
                    Text("🎁 \(promo)")
                        .font(.caption.bold())
                        .foregroundStyle(Color(hex: venue.accentColorHex))
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(Color(hex: venue.accentColorHex).opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: venue.accentColorHex).opacity(0.4)))
                        .padding(12)
                }

                VStack {
                    HStack {
                        Spacer()
                        HStack(spacing: 4) {
                            Text("★").foregroundStyle(.yellow)
                            Text("\(venue.rating, specifier: "%.1f")").foregroundStyle(.white).fontWeight(.bold)
                        }
                        .font(.caption)
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(.black.opacity(0.6))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                    Spacer()
                    HStack {
                        Text("OPEN UNTIL \(venue.openUntil)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundStyle(Color(hex: venue.accentColorHex))
                            .padding(.horizontal, 10).padding(.vertical, 4)
                            .background(.black.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                        Spacer()
                    }
                }
                .padding(12)
            }
            .frame(height: 140)

            // Info
            VStack(alignment: .leading, spacing: 8) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 3) {
                        Text(venue.name)
                            .font(.title3.weight(.black))
                            .foregroundStyle(.white)
                            .tracking(2)
                        Text("\(venue.area) · \(venue.vibe)")
                            .font(.caption)
                            .foregroundStyle(Color(white: 0.35))
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("$\(venue.minSpend)")
                            .font(.title3.bold())
                            .foregroundStyle(Color(hex: venue.accentColorHex))
                        Text("min spend").font(.system(size: 9)).foregroundStyle(Color(white: 0.25))
                    }
                }

                // Tags
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(venue.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundStyle(Color(white: 0.4))
                                .padding(.horizontal, 10).padding(.vertical, 4)
                                .background(Color(white: 0.08))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(white: 0.13)))
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Color(white: 0.05))
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(white: 0.1)))
    }
}

#Preview {
    DiscoverView()
}
