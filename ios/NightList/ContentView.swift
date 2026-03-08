import SwiftUI

struct ContentView: View {
    @State private var selectedTab: Tab = .discover

    enum Tab {
        case discover, bookings, owner
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            DiscoverView()
                .tabItem {
                    Label("Discover", systemImage: "magnifyingglass")
                }
                .tag(Tab.discover)

            MyBookingsView()
                .tabItem {
                    Label("My Bookings", systemImage: "ticket")
                }
                .tag(Tab.bookings)

            OwnerDashboardView()
                .tabItem {
                    Label("Owner", systemImage: "chart.bar")
                }
                .tag(Tab.owner)
        }
        .tint(Color("Gold")) // #C9A84C — define in Assets.xcassets
    }
}

#Preview {
    ContentView()
}
