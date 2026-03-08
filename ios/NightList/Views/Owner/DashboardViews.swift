import SwiftUI

// MARK: - My Bookings
struct MyBookingsView: View {
    // TODO: Replace with @StateObject BookingViewModel pulling from Supabase
    let bookings: [Booking] = []

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                VStack(alignment: .leading, spacing: 0) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("My Reservations")
                            .font(.system(size: 26, weight: .black))
                            .foregroundStyle(.white)
                        Text("\(bookings.count) upcoming")
                            .foregroundStyle(Color(white: 0.35))
                            .font(.subheadline)
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 16)

                    if bookings.isEmpty {
                        VStack(spacing: 16) {
                            Text("🗓️").font(.system(size: 48))
                            Text("No reservations yet").foregroundStyle(Color(white: 0.35)).font(.body)
                            NavigationLink(destination: DiscoverView()) {
                                Text("Find a Club")
                                    .font(.subheadline.bold())
                                    .foregroundStyle(.black)
                                    .padding(.horizontal, 24).padding(.vertical, 12)
                                    .background(Color(hex: "#C9A84C"))
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        ScrollView {
                            VStack(spacing: 14) {
                                ForEach(bookings) { booking in
                                    BookingCard(booking: booking)
                                }
                            }
                            .padding(.horizontal, 20)
                            .padding(.bottom, 30)
                        }
                    }
                }
            }
            .navigationBarHidden(true)
        }
    }
}

struct BookingCard: View {
    let booking: Booking

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(booking.venueName)
                        .font(.title3.weight(.black))
                        .foregroundStyle(Color(hex: "#C9A84C"))
                        .tracking(2)
                    Text("\(booking.tableLabel) · \(booking.date)")
                        .foregroundStyle(Color(white: 0.35))
                        .font(.caption)
                    Text("\(booking.partySize) guests")
                        .foregroundStyle(Color(white: 0.25))
                        .font(.caption)
                }
                Spacer()
                Text(booking.status.rawValue.uppercased())
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(booking.status == .confirmed ? .green : .yellow)
                    .padding(.horizontal, 10).padding(.vertical, 4)
                    .background((booking.status == .confirmed ? Color.green : Color.yellow).opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("CODE").font(.system(size: 9)).foregroundStyle(Color(white: 0.3)).tracking(2)
                    Text(booking.confirmationCode)
                        .font(.system(size: 18, weight: .black))
                        .foregroundStyle(.white)
                        .tracking(4)
                }
                Spacer()
                Text("$\(booking.minimumSpend.formatted())")
                    .font(.title3.bold())
                    .foregroundStyle(Color(hex: "#C9A84C"))
            }
            .padding(14)
            .background(Color(white: 0.07))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .padding(18)
        .background(Color(white: 0.04))
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(white: 0.08)))
    }
}

// MARK: - Owner Dashboard
struct OwnerDashboardView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {

                        // Header
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Owner View")
                                .font(.caption.bold()).foregroundStyle(Color(white: 0.3)).tracking(2).textCase(.uppercase)
                            Text("NOIR Dashboard")
                                .font(.system(size: 24, weight: .black)).foregroundStyle(.white)
                            Text("Saturday, March 8 · Tonight")
                                .foregroundStyle(Color(white: 0.35)).font(.subheadline)
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 16)

                        // Stats Grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                            OwnerStatCard(icon: "📋", label: "Reservations", value: "24", color: Color(hex: "#C9A84C"), sub: "+6 vs last Sat")
                            OwnerStatCard(icon: "💰", label: "Projected Revenue", value: "$18.4K", color: .green, sub: "+12% vs last Sat")
                            OwnerStatCard(icon: "🪑", label: "Tables Booked", value: "6/8", color: Color(hex: "#818CF8"), sub: "2 available")
                            OwnerStatCard(icon: "🎤", label: "Promoters Active", value: "4", color: Color(hex: "#F472B6"), sub: "3 online now")
                        }
                        .padding(.horizontal, 20)

                        // Tonight's Reservations
                        SectionHeader(title: "Tonight's Reservations")

                        VStack(spacing: 10) {
                            ForEach([
                                ("James K.", "VIP 1", "10:30 PM", 6, "$1,200", true),
                                ("Sofia R.", "Section A", "11:00 PM", 4, "$600", true),
                                ("Marcus T.", "Booth 1", "11:30 PM", 5, "$400", false),
                                ("Alicia M.", "Bar 1", "12:00 AM", 3, "$200", true),
                            ], id: \.0) { name, table, time, party, spend, confirmed in
                                OwnerBookingRow(name: name, table: table, time: time, party: party, spend: spend, confirmed: confirmed)
                            }
                        }
                        .padding(.horizontal, 20)

                        // Promoter Performance
                        SectionHeader(title: "Promoter Performance")

                        VStack(spacing: 8) {
                            ForEach([
                                ("🏆", "DJ Marcus", 8, "$4,200"),
                                ("⭐", "Lena V.", 6, "$3,100"),
                                ("⭐", "Rico T.", 5, "$2,800"),
                            ], id: \.1) { badge, name, bookings, revenue in
                                HStack(spacing: 12) {
                                    Text(badge).font(.title2)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(name).font(.subheadline.bold()).foregroundStyle(.white)
                                        Text("\(bookings) bookings tonight").font(.caption).foregroundStyle(Color(white: 0.35))
                                    }
                                    Spacer()
                                    Text(revenue).font(.subheadline.bold()).foregroundStyle(.green)
                                }
                                .padding(14)
                                .background(Color(white: 0.04))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.08)))
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 30)
                    }
                }
            }
            .navigationBarHidden(true)
        }
    }
}

struct OwnerStatCard: View {
    let icon: String; let label: String; let value: String; let color: Color; let sub: String
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(icon).font(.title2)
            Text(value).font(.title2.bold()).foregroundStyle(color)
            Text(label).font(.system(size: 10)).foregroundStyle(Color(white: 0.35)).textCase(.uppercase).tracking(0.5)
            Text(sub).font(.system(size: 9)).foregroundStyle(Color(white: 0.2))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Color(white: 0.04))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(white: 0.08)))
    }
}

struct OwnerBookingRow: View {
    let name: String; let table: String; let time: String; let party: Int; let spend: String; let confirmed: Bool
    var body: some View {
        HStack(spacing: 12) {
            Circle().fill(Color(white: 0.1)).frame(width: 36, height: 36).overlay(Text("👤").font(.body))
            VStack(alignment: .leading, spacing: 2) {
                Text(name).font(.subheadline.bold()).foregroundStyle(.white)
                Text("\(table) · \(time) · \(party) ppl").font(.caption).foregroundStyle(Color(white: 0.35))
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                Text(spend).font(.subheadline.bold()).foregroundStyle(Color(hex: "#C9A84C"))
                Text(confirmed ? "CONFIRMED" : "PENDING")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(confirmed ? .green : .yellow)
                    .padding(.horizontal, 8).padding(.vertical, 3)
                    .background((confirmed ? Color.green : Color.yellow).opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 6))
            }
        }
        .padding(14)
        .background(Color(white: 0.04))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(white: 0.08)))
    }
}

struct SectionHeader: View {
    let title: String
    var body: some View {
        Text(title)
            .font(.caption.bold()).foregroundStyle(Color(white: 0.3)).tracking(2).textCase(.uppercase)
            .padding(.horizontal, 20).padding(.top, 20).padding(.bottom, 10)
    }
}

#Preview { MyBookingsView() }
