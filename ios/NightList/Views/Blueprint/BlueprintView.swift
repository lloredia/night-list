import SwiftUI

struct BlueprintView: View {
    let venue: Venue
    var selectedDate: String = "SAT, MAR 8"
    @Environment(\.dismiss) var dismiss
    @State private var selectedTable: VenueTable?
    @State private var showTableSheet = false
    @State private var scale: CGFloat = 1.0
    @State private var baseScale: CGFloat = 1.0
    @State private var offset: CGSize = .zero

    var availableCount: Int {
        venue.tables.filter { $0.isAvailable }.count
    }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {

                // Header
                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(venue.name)
                            .font(.headline.weight(.semibold))
                            .foregroundStyle(.white)
                        Text("Floor plan")
                            .font(.subheadline)
                            .foregroundStyle(Color(white: 0.45))
                    }
                    Spacer()
                    HStack(spacing: 6) {
                        Image(systemName: "table.furniture")
                            .font(.caption2)
                        Text("\(availableCount) available")
                            .font(.subheadline.weight(.medium))
                    }
                    .foregroundStyle(.green)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.green.opacity(0.15))
                    .clipShape(Capsule())
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 10)

                // Legend
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(VenueTable.TableType.allCases, id: \.self) { type in
                            HStack(spacing: 6) {
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(type.color.opacity(0.9))
                                    .frame(width: 12, height: 12)
                                Text(type.label)
                                    .font(.caption)
                                    .foregroundStyle(Color(white: 0.5))
                            }
                        }
                        HStack(spacing: 6) {
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color(white: 0.2))
                                .frame(width: 12, height: 12)
                            Text("Booked")
                                .font(.caption)
                                .foregroundStyle(Color(white: 0.5))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color(white: 0.06))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 12)

                // Blueprint Canvas
                GeometryReader { geo in
                    ZStack {
                        // Floor background + grid
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color(white: 0.06))
                            .overlay(BlueprintGrid())
                            .clipShape(RoundedRectangle(cornerRadius: 16))

                        // Stage
                        HStack(spacing: 8) {
                            Image(systemName: "waveform")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(Color(white: 0.5))
                            Text("Stage")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(Color(white: 0.6))
                        }
                        .frame(width: 140, height: 36)
                        .background(
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color(white: 0.09))
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(white: 0.14), lineWidth: 1))
                        )
                        .position(x: geo.size.width / 2, y: 32)

                        // Dance floor
                        Text("Dance floor")
                            .font(.caption)
                            .foregroundStyle(Color(white: 0.25))
                            .frame(width: 110, height: 40)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.white.opacity(0.03))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 10)
                                            .strokeBorder(Color(white: 0.12), style: StrokeStyle(lineWidth: 1, dash: [6, 4]))
                                    )
                            )
                            .position(x: geo.size.width / 2, y: 78)

                        // Tables
                        ForEach(venue.tables) { table in
                            TableNode(table: table, isSelected: selectedTable?.id == table.id)
                                .position(x: table.layoutX + table.layoutWidth / 2,
                                          y: table.layoutY + table.layoutHeight / 2)
                                .onTapGesture {
                                    guard table.isAvailable else { return }
                                    selectedTable = table
                                    showTableSheet = true
                                }
                        }

                        // Bar
                        HStack(spacing: 8) {
                            Image(systemName: "wineglass.fill")
                                .font(.system(size: 12))
                                .foregroundStyle(Color(hex: "#0891B2").opacity(0.9))
                            Text("Bar")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(Color(hex: "#0891B2").opacity(0.9))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 32)
                        .background(
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color(hex: "#0a1218"))
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "#0891B2").opacity(0.35), lineWidth: 1))
                        )
                        .padding(.horizontal, 20)
                        .position(x: geo.size.width / 2, y: geo.size.height - 28)
                    }
                    .scaleEffect(scale)
                    .offset(offset)
                    .gesture(
                        MagnificationGesture()
                            .onChanged { value in
                                scale = max(0.8, min(2.5, baseScale * value))
                            }
                            .onEnded { _ in
                                baseScale = scale
                            }
                    )
                }
                .background(Color(white: 0.08))
                .clipShape(RoundedRectangle(cornerRadius: 20))
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(white: 0.12), lineWidth: 1))
                .padding(.horizontal, 16)
                .padding(.bottom, 20)
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button(action: { dismiss() }) {
                    Image(systemName: "chevron.left").foregroundStyle(.white)
                        .padding(8).background(Color(white: 0.1)).clipShape(Circle())
                }
            }
        }
        .sheet(isPresented: $showTableSheet) {
            if let table = selectedTable {
                TableDetailView(table: table, venue: venue, selectedDate: selectedDate)
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
            }
        }
    }
}

// MARK: - Table Node
struct TableNode: View {
    let table: VenueTable
    let isSelected: Bool

    var body: some View {
        ZStack(alignment: .topTrailing) {
            // Table shape
            RoundedRectangle(cornerRadius: 8)
                .fill(
                    table.isAvailable
                        ? table.type.color.opacity(0.18)
                        : LinearGradient(colors: [Color(white: 0.1), Color(white: 0.07)], startPoint: .topLeading, endPoint: .bottomTrailing)
                )
                .frame(width: table.layoutWidth, height: table.layoutHeight)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(
                            table.isAvailable ? table.type.color : Color(white: 0.18),
                            lineWidth: isSelected ? 2.5 : 1
                        )
                )
                .shadow(color: table.isAvailable ? table.type.color.opacity(0.25) : .clear, radius: isSelected ? 12 : 6)
                .shadow(color: .black.opacity(0.3), radius: 2, x: 0, y: 1)

            if table.isAvailable {
                VStack(spacing: 1) {
                    Text(table.label)
                        .font(.system(size: 9, weight: .semibold))
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                        .lineLimit(1)
                    Text("$\(table.price)")
                        .font(.system(size: 8, weight: .medium))
                        .foregroundStyle(table.type.color)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                Image(systemName: "lock.fill")
                    .font(.system(size: 12))
                    .foregroundStyle(Color(white: 0.35))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }

            // Promo indicator
            if table.promoText != nil, table.isAvailable {
                Image(systemName: "tag.fill")
                    .font(.system(size: 7))
                    .foregroundStyle(Color("Gold"))
                    .frame(width: 14, height: 14)
                    .background(Circle().fill(Color.black.opacity(0.6)))
                    .offset(x: 4, y: -4)
            }
        }
        .scaleEffect(isSelected ? 1.06 : 1.0)
        .animation(.spring(response: 0.25, dampingFraction: 0.7), value: isSelected)
    }
}

// MARK: - Blueprint Grid Background
struct BlueprintGrid: View {
    var body: some View {
        Canvas { context, size in
            let spacing: CGFloat = 24
            context.opacity = 0.04
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
            context.stroke(path, with: .color(Color(white: 0.5)), lineWidth: 0.5)
        }
    }
}

#Preview {
    NavigationStack { BlueprintView(venue: .mock) }
}
