import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHome from "@/pages/DashboardHome";
import BookingsPage from "@/pages/BookingsPage";
import FloorPlanPage from "@/pages/FloorPlanPage";
import PromotersPage from "@/pages/PromotersPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pages: Record<string, JSX.Element> = {
    dashboard: <DashboardHome />,
    bookings: <BookingsPage />,
    floorplan: <FloorPlanPage />,
    promoters: <PromotersPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-hidden">
        {pages[activePage] || <DashboardHome />}
      </main>
    </div>
  );
}
