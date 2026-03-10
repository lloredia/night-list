import SwiftUI

struct DiscoverView: View {
    @State private var selectedDate = "SAT, MAR 8"
    @State private var searchText = ""

    let dates = ["FRI, MAR 7", "SAT, MAR 8", "SUN, MAR 9", "FRI, MAR 14"]
    let venues = Venue.mockVenues // TODO: Replace with @StateObject VenueViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {

                        // Header
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Discover")
                                    .font(.subheadline.weight(.medium))
                                    .foregroundStyle(Color(white: 0.45))
                                Text("Venues tonight")
                                    .font(.title2.weight(.semibold))
                                    .foregroundStyle(.white)
                            }
                            Spacer()
                            Image(systemName: "person.circle.fill")
                                .font(.system(size: 32))
                                .foregroundStyle(Color(white: 0.35))
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 8)

                        // Search Bar
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .font(.subheadline.weight(.medium))
                                .foregroundStyle(Color(white: 0.4))
                            Text("Search venues, areas...")
                                .foregroundStyle(Color(white: 0.35))
                                .font(.subheadline)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(white: 0.06))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(white: 0.1), lineWidth: 1))
                        .padding(.horizontal, 20)
                        .padding(.top, 16)

                        // Date Selector
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(dates, id: \.self) { date in
                                    Button(date) {
                                        selectedDate = date
                                    }
                                    .font(.subheadline.weight(.medium))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedDate == date ? Color("Gold") : Color(white: 0.08))
                                    .foregroundStyle(selectedDate == date ? .black : Color(white: 0.45))
                                    .clipShape(Capsule())
                                    .overlay(Capsule().stroke(Color(white: 0.12), lineWidth: 1).opacity(selectedDate == date ? 0 : 1))
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        .padding(.top, 12)

                        // Section Header
                        Text("Featured")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(Color(white: 0.4))
                            .padding(.horizontal, 20)
                            .padding(.top, 24)
                            .padding(.bottom, 10)

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
                    .frame(height: 120)

                Image(systemName: "building.2.fill")
                    .font(.system(size: 40))
                    .foregroundStyle(Color(white: 0.15))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                if let promo = venue.promoText {
                    HStack(spacing: 6) {
                        Image(systemName: "tag.fill")
                            .font(.caption2)
                        Text(promo)
                            .font(.caption.weight(.semibold))
                    }
                    .foregroundStyle(Color(hex: venue.accentColorHex))
                    .padding(.horizontal, 10).padding(.vertical, 5)
                    .background(Color(hex: venue.accentColorHex).opacity(0.2))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .padding(12)
                }

                VStack {
                    HStack {
                        Spacer()
                        HStack(spacing: 4) {
                            Image(systemName: "star.fill")
                                .font(.caption2)
                                .foregroundStyle(Color("Gold"))
                            Text("\(venue.rating, specifier: "%.1f")")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.white)
                        }
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(.black.opacity(0.5))
                        .clipShape(RoundedRectangle(cornerRadius: 6))
                    }
                    Spacer()
                    HStack {
                        HStack(spacing: 4) {
                            Image(systemName: "clock")
                                .font(.system(size: 9, weight: .semibold))
                            Text("Until \(venue.openUntil)")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .foregroundStyle(Color(hex: venue.accentColorHex))
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(.black.opacity(0.5))
                        .clipShape(RoundedRectangle(cornerRadius: 6))
                        Spacer()
                    }
                }
                .padding(12)
            }
            .frame(height: 120)

            // Info
            VStack(alignment: .leading, spacing: 10) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(venue.name)
                            .font(.headline.weight(.semibold))
                            .foregroundStyle(.white)
                        Text("\(venue.area) · \(venue.vibe)")
                            .font(.subheadline)
                            .foregroundStyle(Color(white: 0.4))
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 0) {
                        Text("$\(venue.minSpend)")
                            .font(.subheadline.weight(.bold))
                            .foregroundStyle(Color(hex: venue.accentColorHex))
                        Text("min")
                            .font(.system(size: 10))
                            .foregroundStyle(Color(white: 0.35))
                    }
                }

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(venue.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundStyle(Color(white: 0.45))
                                .padding(.horizontal, 8).padding(.vertical, 4)
                                .background(Color(white: 0.08))
                                .clipShape(RoundedRectangle(cornerRadius: 6))
                        }
                    }
                }
            }
            .padding(14)
        }
        .background(Color(white: 0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(white: 0.1), lineWidth: 1))
    }
}

#Preview {
    DiscoverView()
}
