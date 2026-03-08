const NAV = [
  { id: "dashboard", label: "Dashboard", path: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { id: "bookings", label: "Bookings", path: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" },
  { id: "floorplan", label: "Floor Plan", path: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.09 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" },
  { id: "promoters", label: "Promoters", path: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
  { id: "analytics", label: "Analytics", path: "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5-1.5z" },
  { id: "settings", label: "Settings", path: "M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" },
];

function NavIcon({ path, active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" aria-hidden>
      <path d={path} fill="currentColor" stroke="none" />
    </svg>
  );
}

const VENUE_STATUS = {
  label: "Hours Pending",
  dotClass: "bg-[var(--text-muted)]",
  textClass: "text-[var(--text-muted)]",
};

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-full md:w-60 bg-[var(--bg-elevated)] border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-row md:flex-col items-start md:items-stretch py-4 md:py-6 px-4 gap-4 md:gap-0 flex-shrink-0">
      <div className="px-2 flex-shrink-0">
        <div className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">Night</div>
        <div className="text-xl md:text-2xl font-medium tracking-tight text-[var(--accent)] -mt-1">List</div>
        <div className="text-[11px] text-[var(--text-muted)] tracking-wide mt-1 uppercase">Owner Portal</div>
      </div>

      <div className="hidden md:block bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] p-3 mb-6">
        <div className="text-[11px] text-[var(--text-muted)] tracking-wide uppercase mb-1">Active Venue</div>
        <div className="text-[var(--text-primary)] font-semibold tracking-tight">NOIR</div>
        <div className="text-[var(--text-muted)] text-xs">Manhattan, NY</div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${VENUE_STATUS.dotClass}`} />
          <span className={`text-[11px] ${VENUE_STATUS.textClass}`}>{VENUE_STATUS.label}</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col gap-0.5 overflow-x-auto md:overflow-visible">
        {NAV.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)] whitespace-nowrap flex-shrink-0
                ${active
                  ? "bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)] border border-transparent"}`}
            >
              <span className={active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
                <NavIcon path={item.path} active={active} />
              </span>
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
            </button>
          );
        })}
      </nav>

      <div className="hidden md:flex items-center gap-3 px-2 pt-4 border-t border-[var(--border)]">
        <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
          <span className="text-[var(--text-muted)] text-xs font-medium">O</span>
        </div>
        <div>
          <div className="text-[var(--text-primary)] text-xs font-semibold">Club Owner</div>
          <div className="text-[var(--text-muted)] text-[11px]">owner@noir.com</div>
        </div>
      </div>
    </aside>
  );
}
