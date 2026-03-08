import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import DashboardHome from "./pages/DashboardHome";
import BookingsPage from "./pages/BookingsPage";
import FloorPlanPage from "./pages/FloorPlanPage";
import PromotersPage from "./pages/PromotersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const pages = {
    dashboard: <DashboardHome />,
    bookings: <BookingsPage />,
    floorplan: <FloorPlanPage />,
    promoters: <PromotersPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)] md:flex-row">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {pages[activePage] || <DashboardHome />}
      </main>
    </div>
  );
}
