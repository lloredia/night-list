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
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(venue.name) · Floor Plan")
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text("Tap a table to see details")
                            .font(.caption)
                            .foregroundStyle(Color(white: 0.35))
                    }
                    Spacer()
                    Text("\(availableCount) Available")
                        .font(.caption.bold())
                        .foregroundStyle(.green)
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(.green.opacity(0.12))
                        .clipShape(Capsule())
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 12)

                // Legend
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(VenueTable.TableType.allCases, id: \.self) { type in
                            HStack(spacing: 5) {
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(type.color)
                                    .frame(width: 10, height: 10)
                                Text(type.label)
                                    .font(.system(size: 10))
                                    .foregroundStyle(Color(white: 0.4))
                            }
                        }
                        HStack(spacing: 5) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color(white: 0.15))
                                .frame(width: 10, height: 10)
                            Text("Unavailable")
                                .font(.system(size: 10))
                                .foregroundStyle(Color(white: 0.4))
                        }
                    }
                    .padding(.horizontal, 20)
                }
                .padding(.bottom, 8)

                // Blueprint Canvas
                GeometryReader { geo in
                    ZStack {
                        // Background grid
                        BlueprintGrid()

                        // Stage
                        VStack(spacing: 2) {
                            Text("🎵 Stage / DJ")
                                .font(.system(size: 9))
                                .foregroundStyle(Color(white: 0.3))
                                .tracking(2)
                        }
                        .frame(width: 160, height: 30)
                        .background(Color(white: 0.07))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(white: 0.15)))
                        .position(x: geo.size.width / 2, y: 30)

                        // Dance Floor
                        Text("DANCE FLOOR")
                            .font(.system(size: 8))
                            .foregroundStyle(Color(white: 0.2))
                            .tracking(2)
                            .frame(width: 120, height: 35)
                            .background(Color.white.opacity(0.02))
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(white: 0.1), style: StrokeStyle(dash: [4])))
                            .position(x: geo.size.width / 2, y: 80)

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
                        Text("🍸  MAIN BAR")
                            .font(.system(size: 10))
                            .foregroundStyle(Color(hex: "#0891B2"))
                            .tracking(3)
                            .frame(maxWidth: .infinity)
                            .frame(height: 28)
                            .background(Color(hex: "#050d12"))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "#0891B2").opacity(0.3)))
                            .padding(.horizontal, 16)
                            .position(x: geo.size.width / 2, y: geo.size.height - 24)
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
                .background(Color(white: 0.04))
                .clipShape(RoundedRectangle(cornerRadius: 20))
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(white: 0.08)))
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
        ZStack {
            RoundedRectangle(cornerRadius: 10)
                .fill(table.isAvailable ? table.type.color.opacity(0.15) : Color(white: 0.08))
                .frame(width: table.layoutWidth, height: table.layoutHeight)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(table.isAvailable ? table.type.color : Color(white: 0.15), lineWidth: isSelected ? 2.5 : 1.5)
                )
                .shadow(color: table.isAvailable ? table.type.color.opacity(0.3) : .clear, radius: 8)

            if table.isAvailable {
                VStack(spacing: 2) {
                    Text(table.label).font(.system(size: 8, weight: .bold)).foregroundStyle(table.type.color).multilineTextAlignment(.center)
                    Text("$\(table.price)").font(.system(size: 7)).foregroundStyle(table.type.color.opacity(0.7))
                }
            } else {
                Text("🔒").font(.system(size: 14))
            }

            if let _ = table.promoText, table.isAvailable {
                Circle().fill(Color(hex: "#C9A84C")).frame(width: 14, height: 14)
                    .overlay(Text("🎁").font(.system(size: 7)))
                    .offset(x: table.layoutWidth / 2 - 4, y: -table.layoutHeight / 2 + 4)
            }
        }
        .scaleEffect(isSelected ? 1.08 : 1.0)
        .animation(.spring(response: 0.3), value: isSelected)
    }
}

// MARK: - Blueprint Grid Background
struct BlueprintGrid: View {
    var body: some View {
        Canvas { context, size in
            let spacing: CGFloat = 20
            context.opacity = 0.06
            var path = Path()
            var x: CGFloat = 0
            while x <= size.width { path.move(to: CGPoint(x: x, y: 0)); path.addLine(to: CGPoint(x: x, y: size.height)); x += spacing }
            var y: CGFloat = 0
            while y <= size.height { path.move(to: CGPoint(x: 0, y: y)); path.addLine(to: CGPoint(x: size.width, y: y)); y += spacing }
            context.stroke(path, with: .color(Color(hex: "#C9A84C")), lineWidth: 0.5)
        }
    }
}

#Preview {
    NavigationStack { BlueprintView(venue: .mock) }
}
