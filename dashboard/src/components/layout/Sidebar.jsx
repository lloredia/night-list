const NAV = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "bookings", icon: "📋", label: "Bookings" },
  { id: "floorplan", icon: "🗺️", label: "Floor Plan" },
  { id: "promoters", icon: "🎤", label: "Promoters" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const VENUE_STATUS = {
  label: "Hours Pending",
  dotClass: "bg-[#555]",
  textClass: "text-[#666]",
};

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-full md:w-60 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#1a1a1a] flex flex-row md:flex-col items-start md:items-stretch py-4 md:py-6 px-4 gap-4 md:gap-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-2 flex-shrink-0">
        <div className="text-xl md:text-2xl font-black tracking-widest text-white">NIGHT</div>
        <div className="text-xl md:text-2xl font-thin tracking-widest text-[#C9A84C] -mt-2">LIST</div>
        <div className="text-[10px] text-[#333] tracking-widest mt-1 uppercase">Owner Portal</div>
      </div>

      {/* Venue Badge */}
      <div className="hidden md:block bg-[#111] border border-[#1e1e1e] rounded-xl p-3 mb-6">
        <div className="text-[10px] text-[#444] tracking-widest uppercase mb-1">Active Venue</div>
        <div className="text-white font-bold tracking-widest">NOIR</div>
        <div className="text-[#555] text-xs">Manhattan, NY</div>
        <div className="mt-2 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${VENUE_STATUS.dotClass}`} />
          <span className={`text-[10px] ${VENUE_STATUS.textClass}`}>{VENUE_STATUS.label}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {NAV.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] whitespace-nowrap flex-shrink-0
              ${activePage === item.id
                ? "bg-[#C9A84C15] text-[#C9A84C] border border-[#C9A84C30]"
                : "text-[#444] hover:text-[#888] hover:bg-[#111]"}`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
            {activePage === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
          </button>
        ))}
      </nav>

      {/* Profile */}
      <div className="hidden md:flex items-center gap-3 px-2 pt-4 border-t border-[#1a1a1a]">
        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-sm">👤</div>
        <div>
          <div className="text-white text-xs font-bold">Club Owner</div>
          <div className="text-[#444] text-[10px]">owner@noir.com</div>
        </div>
      </div>
    </aside>
  );
}
