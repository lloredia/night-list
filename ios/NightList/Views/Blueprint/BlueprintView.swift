import SwiftUI

struct BlueprintView: View {
    let venue: Venue
    let selectedDate: String
    @Environment(\.dismiss) var dismiss
    @State private var selectedTable: VenueTable?
    @State private var showTableSheet = false
    @State private var scale: CGFloat = 1.0
    @State private var animateIn = false

    var availableCount: Int { venue.tables.filter { $0.isAvailable }.count }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {

                // ── Header ──────────────────────────────────────────
                HStack(alignment: .center, spacing: 12) {
                    Button(action: { dismiss() }) {
                        ZStack {
                            Circle()
                                .fill(.white.opacity(0.07))
                                .frame(width: 38, height: 38)
                            Image(systemName: "chevron.left")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(.white)
                        }
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(venue.name)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundStyle(.white)
                        Text("Floor Plan")
                            .font(.system(size: 12, weight: .regular))
                            .foregroundStyle(.white.opacity(0.4))
                        Text(selectedDate)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundStyle(.white.opacity(0.45))
                    }

                    Spacer()

                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color(hex: "#4ade80"))
                            .frame(width: 7, height: 7)
                            .shadow(color: Color(hex: "#4ade80").opacity(0.8), radius: 4)
                        Text("\(availableCount) available")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Color(hex: "#4ade80"))
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 7)
                    .background(Color(hex: "#4ade80").opacity(0.1))
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(Color(hex: "#4ade80").opacity(0.25), lineWidth: 1))
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 12)

                // ── Legend ───────────────────────────────────────────
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(VenueTable.TableType.allCases, id: \.self) { type in
                            HStack(spacing: 6) {
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(type.color)
                                    .frame(width: 8, height: 8)
                                Text(type.label)
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundStyle(.white.opacity(0.45))
                            }
                        }
                        HStack(spacing: 6) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color.white.opacity(0.12))
                                .frame(width: 8, height: 8)
                            Text("Booked")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundStyle(.white.opacity(0.45))
                        }
                    }
                    .padding(.horizontal, 20)
                }
                .padding(.bottom, 12)

                // ── Blueprint Canvas ─────────────────────────────────
                GeometryReader { geo in
                    ZStack {
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color(white: 0.04))

                        BlueprintGrid()
                            .clipShape(RoundedRectangle(cornerRadius: 20))

                        // Stage
                        VStack(spacing: 4) {
                            Image(systemName: "waveform")
                                .font(.system(size: 12))
                                .foregroundStyle(.white.opacity(0.3))
                            Text("Stage")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundStyle(.white.opacity(0.4))
                        }
                        .frame(width: 150, height: 44)
                        .background(.white.opacity(0.04))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(.white.opacity(0.08), lineWidth: 1))
                        .position(x: geo.size.width / 2, y: 36)

                        // Dance Floor
                        Text("Dance Floor")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(.white.opacity(0.18))
                            .frame(width: 110, height: 32)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(.white.opacity(0.08), style: StrokeStyle(dash: [4, 3])))
                            .position(x: geo.size.width / 2, y: 92)

                        // Tables
                        ForEach(Array(venue.tables.enumerated()), id: \.element.id) { index, table in
                            TableNodeView(
                                table: table,
                                isSelected: selectedTable?.id == table.id,
                                animateIn: animateIn,
                                index: index
                            )
                            .position(
                                x: table.layoutX + table.layoutWidth / 2,
                                y: table.layoutY + table.layoutHeight / 2
                            )
                            .onTapGesture {
                                guard table.isAvailable else { return }
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                    selectedTable = table
                                }
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                                    showTableSheet = true
                                }
                            }
                        }

                        // Bar
                        HStack(spacing: 8) {
                            Image(systemName: "wineglass")
                                .font(.system(size: 12))
                                .foregroundStyle(Color(hex: "#0891B2"))
                            Text("Bar")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(Color(hex: "#0891B2"))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 36)
                        .background(Color(hex: "#0891B2").opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "#0891B2").opacity(0.2), lineWidth: 1))
                        .padding(.horizontal, 16)
                        .position(x: geo.size.width / 2, y: geo.size.height - 28)
                    }
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(.white.opacity(0.06), lineWidth: 1))
                    .gesture(
                        MagnificationGesture()
                            .onChanged { val in scale = max(0.9, min(2.0, val)) }
                    )
                    .scaleEffect(scale)
                    .animation(.spring(response: 0.3), value: scale)
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            withAnimation(.easeOut(duration: 0.6)) { animateIn = true }
        }
        .sheet(isPresented: $showTableSheet) {
            if let table = selectedTable {
                TableDetailView(table: table, venue: venue)
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
                    .presentationBackground(Color(white: 0.04))
                    .presentationCornerRadius(28)
            }
        }
    }
}

// MARK: - Table Detail
struct TableDetailView: View {
    let table: VenueTable
    let venue: Venue

    var body: some View {
        VStack(spacing: 16) {
            Capsule()
                .fill(Color.white.opacity(0.2))
                .frame(width: 40, height: 5)
                .padding(.top, 8)

            VStack(spacing: 6) {
                Text(table.label)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(.white)
                Text(table.type.label)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(table.type.color)
            }

            HStack(spacing: 12) {
                DetailPill(label: "Min", value: "$\(table.price)")
                DetailPill(label: "Cap", value: "\(table.capacity)")
                DetailPill(label: "Bottles", value: "\(table.minBottles)")
            }

            VStack(alignment: .leading, spacing: 8) {
                InfoRow(title: "Dress code", value: table.dressCode)
                InfoRow(title: "Arrival", value: table.arrivalDeadline)
                if let promoText = table.promoText {
                    InfoRow(title: "Promo", value: promoText)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Button(action: {}) {
                Text("Request this table")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color(hex: venue.accentColorHex))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .padding(.top, 6)

            Spacer(minLength: 0)
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 24)
        .background(Color(white: 0.04))
    }
}

struct DetailPill: View {
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(.white)
            Text(label)
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.white.opacity(0.4))
        }
        .padding(.vertical, 8)
        .frame(maxWidth: .infinity)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

struct InfoRow: View {
    let title: String
    let value: String

    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.white.opacity(0.4))
            Spacer()
            Text(value)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(.white)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Table Node
struct TableNodeView: View {
    let table: VenueTable
    let isSelected: Bool
    let animateIn: Bool
    let index: Int

    @State private var pulse = false

    var color: Color { table.type.color }

    var body: some View {
        ZStack {
            // Ambient glow
            if table.isAvailable {
                RoundedRectangle(cornerRadius: 12)
                    .fill(color.opacity(pulse ? 0.2 : 0.08))
                    .frame(width: table.layoutWidth + 10, height: table.layoutHeight + 10)
                    .blur(radius: 8)
                    .scaleEffect(pulse ? 1.06 : 1.0)
                    .animation(.easeInOut(duration: 2.0).repeatForever(autoreverses: true), value: pulse)
            }

            // Table body
            RoundedRectangle(cornerRadius: 12)
                .fill(table.isAvailable ? color.opacity(0.13) : Color.white.opacity(0.03))
                .frame(width: table.layoutWidth, height: table.layoutHeight)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(
                            table.isAvailable ? color.opacity(isSelected ? 1.0 : 0.7) : Color.white.opacity(0.1),
                            lineWidth: isSelected ? 2 : 1
                        )
                )
                .shadow(
                    color: table.isAvailable ? color.opacity(isSelected ? 0.55 : 0.22) : .clear,
                    radius: isSelected ? 14 : 7
                )

            // Label & price
            if table.isAvailable {
                VStack(spacing: 2) {
                    Text(table.label)
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(color)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                    Text("$\(table.price)")
                        .font(.system(size: 8, weight: .semibold))
                        .foregroundStyle(color.opacity(0.65))
                }
                .frame(width: table.layoutWidth - 8)
            } else {
                Image(systemName: "lock.fill")
                    .font(.system(size: 12))
                    .foregroundStyle(.white.opacity(0.15))
            }

            // Promo indicator
            if table.promoText != nil && table.isAvailable {
                Circle()
                    .fill(Color(hex: "#C9A84C"))
                    .frame(width: 10, height: 10)
                    .overlay(Circle().stroke(Color.black, lineWidth: 1.5))
                    .shadow(color: Color(hex: "#C9A84C").opacity(0.9), radius: 5)
                    .offset(x: table.layoutWidth / 2 - 4, y: -table.layoutHeight / 2 + 4)
            }
        }
        .scaleEffect(isSelected ? 1.09 : (animateIn ? 1.0 : 0.5))
        .opacity(animateIn ? 1.0 : 0.0)
        .animation(
            .spring(response: 0.45, dampingFraction: 0.68)
            .delay(Double(index) * 0.055),
            value: animateIn
        )
        .animation(.spring(response: 0.28, dampingFraction: 0.65), value: isSelected)
        .onAppear { pulse = true }
    }
}

// MARK: - Grid
struct BlueprintGrid: View {
    var body: some View {
        Canvas { context, size in
            let spacing: CGFloat = 24
            context.opacity = 0.035
            var path = Path()
            var x: CGFloat = 0
            while x <= size.width {
                path.move(to: CGPoint(x: x, y: 0))
                path.addLine(to: CGPoint(x: x, y: size.height))
                x += spacing
            }
            var y: CGFloat = 0
            while y <= size.height {
                path.move(to: CGPoint(x: 0, y: y))
                path.addLine(to: CGPoint(x: size.width, y: y))
                y += spacing
            }
            context.stroke(path, with: .color(.white), lineWidth: 0.5)
        }
    }
}

#Preview {
    NavigationStack { BlueprintView(venue: .mock, selectedDate: "SAT, MAR 8") }
}
