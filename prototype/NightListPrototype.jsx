import { useState, useEffect, useRef } from "react";

const SCREENS = {
  SPLASH: "splash",
  DISCOVER: "discover",
  VENUE: "venue",
  BLUEPRINT: "blueprint",
  TABLE_DETAIL: "table_detail",
  BOOKING_CONFIRM: "booking_confirm",
  BOOKING_SUCCESS: "booking_success",
  MY_BOOKINGS: "my_bookings",
  OWNER_DASHBOARD: "owner_dashboard",
};

const venues = [
  {
    id: 1,
    name: "NOIR",
    area: "Manhattan, NY",
    vibe: "Upscale Lounge",
    rating: 4.8,
    reviews: 312,
    image: "🖤",
    gradient: "from-zinc-900 via-stone-900 to-zinc-800",
    accent: "#C9A84C",
    openUntil: "4:00 AM",
    minSpend: 500,
    tags: ["VIP", "Bottle Service", "DJ"],
    promo: "Ladies free before midnight",
    tables: [
      { id: "T1", label: "VIP 1", x: 60, y: 80, w: 70, h: 50, type: "vip", price: 1200, capacity: 8, available: true, promo: "4 ppl in free", minBottles: 2, rules: "No sneakers", arrivalBy: "11PM" },
      { id: "T2", label: "VIP 2", x: 200, y: 80, w: 70, h: 50, type: "vip", price: 1500, capacity: 10, available: false, promo: null, minBottles: 3, rules: "No sneakers", arrivalBy: "10:30PM" },
      { id: "T3", label: "Section A", x: 60, y: 180, w: 55, h: 45, type: "premium", price: 600, capacity: 6, available: true, promo: "2 for 1 mixers", minBottles: 1, rules: "Smart casual", arrivalBy: "11:30PM" },
      { id: "T4", label: "Section B", x: 145, y: 180, w: 55, h: 45, type: "premium", price: 600, capacity: 6, available: true, promo: null, minBottles: 1, rules: "Smart casual", arrivalBy: "11:30PM" },
      { id: "T5", label: "Section C", x: 230, y: 180, w: 55, h: 45, type: "premium", price: 750, capacity: 6, available: false, promo: null, minBottles: 1, rules: "Smart casual", arrivalBy: "11PM" },
      { id: "T6", label: "Bar 1", x: 60, y: 270, w: 45, h: 35, type: "bar", price: 200, capacity: 4, available: true, promo: "Happy hour 9-10PM", minBottles: 0, rules: "21+ only", arrivalBy: "12AM" },
      { id: "T7", label: "Bar 2", x: 120, y: 270, w: 45, h: 35, type: "bar", price: 200, capacity: 4, available: true, promo: null, minBottles: 0, rules: "21+ only", arrivalBy: "12AM" },
      { id: "T8", label: "Booth 1", x: 200, y: 260, w: 50, h: 40, type: "booth", price: 400, capacity: 5, available: true, promo: "4 ppl in free", minBottles: 1, rules: "Smart casual", arrivalBy: "11PM" },
    ]
  },
  {
    id: 2,
    name: "OBSIDIAN",
    area: "Miami, FL",
    vibe: "Rooftop Club",
    rating: 4.9,
    reviews: 541,
    image: "💎",
    gradient: "from-blue-950 via-indigo-950 to-slate-900",
    accent: "#4FC3F7",
    openUntil: "5:00 AM",
    minSpend: 800,
    tags: ["Rooftop", "Ocean View", "Live DJ"],
    promo: "Complimentary champagne on arrival",
    tables: []
  },
  {
    id: 3,
    name: "EMBER",
    area: "Los Angeles, CA",
    vibe: "Speakeasy",
    rating: 4.7,
    reviews: 228,
    image: "🔥",
    gradient: "from-red-950 via-orange-950 to-zinc-900",
    accent: "#FF6B35",
    openUntil: "3:00 AM",
    minSpend: 300,
    tags: ["Speakeasy", "Craft Cocktails", "Intimate"],
    promo: "First round on the house",
    tables: []
  }
];

const tableColors = {
  vip: { bg: "#C9A84C22", border: "#C9A84C", text: "#C9A84C" },
  premium: { bg: "#7C3AED22", border: "#7C3AED", text: "#A78BFA" },
  bar: { bg: "#0891B222", border: "#0891B2", text: "#22D3EE" },
  booth: { bg: "#05966922", border: "#059669", text: "#34D399" },
};

export default function ClubApp() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [splashDone, setSplashDone] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [partySize, setPartySize] = useState(4);
  const [selectedDate, setSelectedDate] = useState("SAT, MAR 8");
  const [pulseTable, setPulseTable] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setSplashDone(true);
      setTimeout(() => setScreen(SCREENS.DISCOVER), 400);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  const goTo = (s) => setScreen(s);

  const confirmBooking = () => {
    const newBooking = {
      id: Date.now(),
      venue: selectedVenue.name,
      table: selectedTable.label,
      date: selectedDate,
      party: partySize,
      price: selectedTable.price,
      confirmCode: "NR" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    };
    setBookings(prev => [newBooking, ...prev]);
    setScreen(SCREENS.BOOKING_SUCCESS);
  };

  return (
    <div style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
      className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-full max-w-sm mx-auto" style={{
        background: "#0A0A0A",
        borderRadius: 44,
        height: 812,
        overflow: "hidden",
        boxShadow: "0 0 0 1px #222, 0 40px 120px rgba(0,0,0,0.9), inset 0 1px 0 #333",
      }}>

        {/* Status Bar */}
        {screen !== SCREENS.SPLASH && (
          <div className="flex justify-between items-center px-6 pt-3 pb-1" style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ width: 120, height: 28, background: "#000", borderRadius: 20, position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }} />
            <div className="flex gap-1 items-center">
              <span>●●●</span>
              <span>WiFi</span>
              <span>⚡</span>
            </div>
          </div>
        )}

        {/* SPLASH */}
        {screen === SCREENS.SPLASH && (
          <div className="flex flex-col items-center justify-center h-full" style={{
            background: "radial-gradient(ellipse at 50% 40%, #1a0a00 0%, #000 70%)",
            opacity: splashDone ? 0 : 1, transition: "opacity 0.4s"
          }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "pulse 2s infinite" }}>🌙</div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 12, color: "#fff", textTransform: "uppercase" }}>NIGHT</div>
            <div style={{ fontSize: 42, fontWeight: 200, letterSpacing: 16, color: "#C9A84C", textTransform: "uppercase", marginTop: -8 }}>LIST</div>
            <div style={{ color: "#555", fontSize: 11, letterSpacing: 4, marginTop: 24, textTransform: "uppercase" }}>Get On The List</div>
            <div style={{ marginTop: 60, width: 40, height: 2, background: "linear-gradient(to right, transparent, #C9A84C, transparent)", animation: "widthPulse 1.5s infinite" }} />
          </div>
        )}

        {/* DISCOVER */}
        {screen === SCREENS.DISCOVER && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ color: "#666", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Good Evening</div>
                  <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Find Your Night 🌙</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: "#1a1a1a", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
              </div>
              {/* Search */}
              <div style={{ marginTop: 16, background: "#141414", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #222" }}>
                <span style={{ fontSize: 16 }}>🔍</span>
                <span style={{ color: "#444", fontSize: 14 }}>Search venues, areas...</span>
              </div>
              {/* Date Row */}
              <div style={{ marginTop: 12, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {["FRI, MAR 7", "SAT, MAR 8", "SUN, MAR 9", "FRI, MAR 14"].map(d => (
                  <button key={d} onClick={() => setSelectedDate(d)} style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: selectedDate === d ? "#C9A84C" : "#1a1a1a",
                    color: selectedDate === d ? "#000" : "#666",
                    border: selectedDate === d ? "none" : "1px solid #2a2a2a",
                    whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0
                  }}>{d}</button>
                ))}
              </div>
            </div>

            {/* Venue Cards */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px" }}>
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Featured Tonight</div>
              {venues.map((v, i) => (
                <div key={v.id} onClick={() => { setSelectedVenue(v); goTo(SCREENS.VENUE); }}
                  style={{
                    marginBottom: 16, borderRadius: 20, overflow: "hidden", cursor: "pointer",
                    background: "linear-gradient(135deg, #111 0%, #0d0d0d 100%)",
                    border: "1px solid #222",
                    transform: "translateY(0)", transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {/* Hero */}
                  <div style={{ height: 140, background: `linear-gradient(135deg, ${i === 0 ? "#1a1410, #0d0a05" : i === 1 ? "#050a1a, #060512" : "#1a0805, #0d0500"})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ fontSize: 64 }}>{v.image}</div>
                    <div style={{ position: "absolute", top: 12, right: 12, background: "#000a", borderRadius: 12, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#FFD700", fontSize: 11 }}>★</span>
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{v.rating}</span>
                    </div>
                    <div style={{ position: "absolute", bottom: 12, left: 12, background: "#000a", borderRadius: 10, padding: "3px 10px" }}>
                      <span style={{ color: v.accent, fontSize: 11, fontWeight: 700 }}>OPEN UNTIL {v.openUntil}</span>
                    </div>
                    {v.promo && (
                      <div style={{ position: "absolute", top: 12, left: 12, background: v.accent + "22", border: `1px solid ${v.accent}55`, borderRadius: 10, padding: "3px 10px" }}>
                        <span style={{ color: v.accent, fontSize: 10, fontWeight: 600 }}>🎁 {v.promo}</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>{v.name}</div>
                        <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{v.area} · {v.vibe}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: v.accent, fontSize: 16, fontWeight: 700 }}>${v.minSpend}</div>
                        <div style={{ color: "#444", fontSize: 10 }}>min spend</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                      {v.tags.map(t => (
                        <span key={t} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "3px 10px", color: "#666", fontSize: 10, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Nav */}
            <BottomNav active={activeTab} onChange={t => {
              setActiveTab(t);
              if (t === "bookings") goTo(SCREENS.MY_BOOKINGS);
              if (t === "discover") goTo(SCREENS.DISCOVER);
              if (t === "owner") goTo(SCREENS.OWNER_DASHBOARD);
            }} />
          </div>
        )}

        {/* VENUE DETAIL */}
        {screen === SCREENS.VENUE && selectedVenue && (
          <div className="flex flex-col h-full overflow-hidden">
            <div style={{ flex: 1, overflowY: "auto" }}>
              {/* Hero */}
              <div style={{ height: 220, background: `linear-gradient(160deg, ${selectedVenue.id === 1 ? "#1a1410, #0d0a05" : selectedVenue.id === 2 ? "#050a1a, #060512" : "#1a0805, #0d0500"})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontSize: 80 }}>{selectedVenue.image}</div>
                <button onClick={() => goTo(SCREENS.DISCOVER)} style={{ position: "absolute", top: 50, left: 20, width: 36, height: 36, borderRadius: 18, background: "#000a", border: "1px solid #333", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #0A0A0A, transparent)" }} />
              </div>

              <div style={{ padding: "16px 20px" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div style={{ color: "#fff", fontSize: 32, fontWeight: 900, letterSpacing: 3 }}>{selectedVenue.name}</div>
                    <div style={{ color: "#555", fontSize: 13 }}>{selectedVenue.area} · {selectedVenue.vibe}</div>
                  </div>
                  <div>
                    <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "6px 12px", textAlign: "center" }}>
                      <div style={{ color: "#FFD700", fontSize: 14 }}>★ {selectedVenue.rating}</div>
                      <div style={{ color: "#444", fontSize: 10 }}>{selectedVenue.reviews} reviews</div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  {[
                    { icon: "🕐", label: "Closes", value: selectedVenue.openUntil },
                    { icon: "💰", label: "Min Spend", value: "$" + selectedVenue.minSpend },
                    { icon: "🎉", label: "Tables", value: selectedVenue.tables.length + " total" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: "#111", borderRadius: 14, padding: "12px 8px", border: "1px solid #1e1e1e", textAlign: "center" }}>
                      <div style={{ fontSize: 18 }}>{s.icon}</div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
                      <div style={{ color: "#444", fontSize: 10 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Promo Banner */}
                {selectedVenue.promo && (
                  <div style={{ marginTop: 16, background: selectedVenue.accent + "15", border: `1px solid ${selectedVenue.accent}40`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🎁</span>
                    <div>
                      <div style={{ color: selectedVenue.accent, fontSize: 12, fontWeight: 700 }}>Tonight's Promo</div>
                      <div style={{ color: "#ccc", fontSize: 13 }}>{selectedVenue.promo}</div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  {selectedVenue.tags.map(t => (
                    <span key={t} style={{ background: "#151515", border: "1px solid #2a2a2a", borderRadius: 10, padding: "5px 12px", color: "#888", fontSize: 12, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>

                {/* CTA */}
                <button onClick={() => goTo(SCREENS.BLUEPRINT)}
                  style={{ marginTop: 24, width: "100%", padding: "16px", borderRadius: 16, background: `linear-gradient(135deg, ${selectedVenue.accent}, ${selectedVenue.accent}bb)`, color: "#000", fontWeight: 800, fontSize: 15, letterSpacing: 1, border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                  View Floor Plan & Reserve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BLUEPRINT */}
        {screen === SCREENS.BLUEPRINT && selectedVenue && (
          <div className="flex flex-col h-full">
            <div style={{ padding: "54px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => goTo(SCREENS.VENUE)} style={{ width: 36, height: 36, borderRadius: 18, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
              <div>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{selectedVenue.name} · Floor Plan</div>
                <div style={{ color: "#555", fontSize: 12 }}>Tap a table to see details</div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto" }}>
              {Object.entries(tableColors).map(([type, c]) => (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.border }} />
                  <span style={{ color: "#555", fontSize: 10, textTransform: "capitalize" }}>{type}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#333" }} />
                <span style={{ color: "#555", fontSize: 10 }}>Unavailable</span>
              </div>
            </div>

            {/* Blueprint Canvas */}
            <div style={{ flex: 1, overflow: "hidden", padding: "0 16px" }}>
              <div style={{
                background: "#0d0d0d",
                borderRadius: 20,
                border: "1px solid #1e1e1e",
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Grid Lines */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
                  {[...Array(20)].map((_, i) => (
                    <line key={`h${i}`} x1={0} y1={i * 20} x2="100%" y2={i * 20} stroke="#C9A84C" strokeWidth={0.5} />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2="100%" stroke="#C9A84C" strokeWidth={0.5} />
                  ))}
                </svg>

                {/* Stage */}
                <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 160, height: 30, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#555", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>🎵 Stage / DJ</span>
                </div>

                {/* Dance Floor */}
                <div style={{ position: "absolute", top: 55, left: "50%", transform: "translateX(-50%)", width: 120, height: 40, background: "#ffffff05", border: "1px dashed #333", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#333", fontSize: 9, letterSpacing: 2 }}>DANCE FLOOR</span>
                </div>

                {/* Tables */}
                {selectedVenue.tables.map(t => {
                  const c = tableColors[t.type];
                  const isAvail = t.available;
                  const isSelected = selectedTable?.id === t.id;
                  return (
                    <div key={t.id}
                      onClick={() => { if (isAvail) { setSelectedTable(t); goTo(SCREENS.TABLE_DETAIL); } }}
                      style={{
                        position: "absolute",
                        left: t.x, top: t.y + 10, width: t.w, height: t.h,
                        background: isAvail ? c.bg : "#1a1a1a",
                        border: `1.5px solid ${isAvail ? c.border : "#333"}`,
                        borderRadius: 10,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        cursor: isAvail ? "pointer" : "default",
                        transition: "all 0.2s",
                        boxShadow: isAvail ? `0 0 12px ${c.border}33` : "none",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <div style={{ color: isAvail ? c.text : "#444", fontSize: 9, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>{t.label}</div>
                      <div style={{ color: isAvail ? c.text : "#333", fontSize: 8, opacity: 0.8 }}>${t.price}</div>
                      {t.promo && isAvail && (
                        <div style={{ position: "absolute", top: -6, right: -4, width: 14, height: 14, background: "#C9A84C", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>🎁</div>
                      )}
                      {!isAvail && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                          <span style={{ fontSize: 14 }}>🔒</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bar Area */}
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, height: 28, background: "#0d1117", border: "1px solid #1e2a3a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#0891B2", fontSize: 10, letterSpacing: 3 }}>🍸 MAIN BAR</span>
                </div>

                {/* Available Count */}
                <div style={{ position: "absolute", top: 12, right: 12, background: "#000a", borderRadius: 10, padding: "4px 10px" }}>
                  <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>
                    {selectedVenue.tables.filter(t => t.available).length} Available
                  </span>
                </div>
              </div>
            </div>
            <div style={{ height: 20 }} />
          </div>
        )}

        {/* TABLE DETAIL */}
        {screen === SCREENS.TABLE_DETAIL && selectedTable && selectedVenue && (
          <div className="flex flex-col h-full">
            <div style={{ padding: "54px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => goTo(SCREENS.BLUEPRINT)} style={{ width: 36, height: 36, borderRadius: 18, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{selectedTable.label}</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
              {/* Table Visual */}
              <div style={{ background: "#0d0d0d", borderRadius: 20, border: `2px solid ${tableColors[selectedTable.type].border}`, padding: 24, marginBottom: 20, textAlign: "center", boxShadow: `0 0 30px ${tableColors[selectedTable.type].border}22` }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🪑</div>
                <div style={{ color: tableColors[selectedTable.type].text, fontSize: 28, fontWeight: 900 }}>${selectedTable.price.toLocaleString()}</div>
                <div style={{ color: "#555", fontSize: 12 }}>Minimum Spend · {selectedTable.capacity} guests max</div>

                {selectedTable.promo && (
                  <div style={{ marginTop: 12, background: "#C9A84C22", border: "1px solid #C9A84C55", borderRadius: 12, padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span>🎁</span>
                    <span style={{ color: "#C9A84C", fontSize: 12, fontWeight: 700 }}>{selectedTable.promo}</span>
                  </div>
                )}
              </div>

              {/* Info Cards */}
              {[
                { icon: "⏰", label: "Arrive By", value: selectedTable.arrivalBy, color: "#F59E0B" },
                { icon: "🍾", label: "Min Bottles", value: selectedTable.minBottles === 0 ? "No minimum" : `${selectedTable.minBottles} bottle${selectedTable.minBottles > 1 ? "s" : ""}`, color: "#8B5CF6" },
                { icon: "📋", label: "Dress Code", value: selectedTable.rules, color: "#EC4899" },
                { icon: "👥", label: "Capacity", value: `Up to ${selectedTable.capacity} people`, color: "#10B981" },
              ].map(item => (
                <div key={item.label} style={{ background: "#0d0d0d", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 2 }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* Party Size */}
              <div style={{ background: "#0d0d0d", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid #1a1a1a" }}>
                <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Party Size</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button onClick={() => setPartySize(Math.max(1, partySize - 1))} style={{ width: 36, height: 36, borderRadius: 18, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 20, cursor: "pointer" }}>−</button>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>{partySize} <span style={{ fontSize: 14, color: "#555" }}>people</span></div>
                  <button onClick={() => setPartySize(Math.min(selectedTable.capacity, partySize + 1))} style={{ width: 36, height: 36, borderRadius: 18, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 20px 30px" }}>
              <button onClick={() => goTo(SCREENS.BOOKING_CONFIRM)} style={{ width: "100%", padding: "16px", borderRadius: 16, background: `linear-gradient(135deg, ${selectedVenue.accent}, ${selectedVenue.accent}bb)`, color: "#000", fontWeight: 800, fontSize: 15, letterSpacing: 1, border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                Reserve This Table
              </button>
            </div>
          </div>
        )}

        {/* BOOKING CONFIRM */}
        {screen === SCREENS.BOOKING_CONFIRM && selectedTable && selectedVenue && (
          <div className="flex flex-col h-full">
            <div style={{ padding: "54px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => goTo(SCREENS.TABLE_DETAIL)} style={{ width: 36, height: 36, borderRadius: 18, background: "#1a1a1a", border: "1px solid #333", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Confirm Reservation</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
              <div style={{ background: "#0d0d0d", borderRadius: 20, border: "1px solid #1e1e1e", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ background: `linear-gradient(135deg, ${selectedVenue.accent}22, #0d0d0d)`, padding: "20px 20px 16px", borderBottom: "1px solid #1e1e1e" }}>
                  <div style={{ color: selectedVenue.accent, fontSize: 22, fontWeight: 900, letterSpacing: 3 }}>{selectedVenue.name}</div>
                  <div style={{ color: "#666", fontSize: 13 }}>{selectedVenue.area}</div>
                </div>
                {[
                  ["Table", selectedTable.label],
                  ["Date", selectedDate],
                  ["Party Size", partySize + " guests"],
                  ["Arrive By", selectedTable.arrivalBy],
                  ["Dress Code", selectedTable.rules],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: "12px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#555", fontSize: 13 }}>{k}</span>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Minimum Spend</span>
                  <span style={{ color: selectedVenue.accent, fontSize: 20, fontWeight: 900 }}>${selectedTable.price.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: "#0d0d0d", borderRadius: 14, padding: "14px 16px", border: "1px solid #1e1e1e", marginBottom: 16 }}>
                <div style={{ color: "#555", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Payment</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 30, background: "#1a1a1a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #333" }}>
                    <span style={{ fontSize: 16 }}>💳</span>
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>•••• •••• •••• 4242</div>
                    <div style={{ color: "#555", fontSize: 11 }}>Visa · Expires 12/26</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "#4ade80", fontSize: 11, fontWeight: 700 }}>✓ Saved</div>
                </div>
              </div>

              <div style={{ background: "#0a1a0a", borderRadius: 14, padding: "12px 16px", border: "1px solid #1a2e1a", marginBottom: 20 }}>
                <div style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>ℹ️ Card charged only at venue. Cancellation allowed up to 4 hours before.</div>
              </div>
            </div>

            <div style={{ padding: "0 20px 30px" }}>
              <button onClick={confirmBooking} style={{ width: "100%", padding: "16px", borderRadius: 16, background: `linear-gradient(135deg, ${selectedVenue.accent}, ${selectedVenue.accent}bb)`, color: "#000", fontWeight: 800, fontSize: 15, letterSpacing: 1, border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                Confirm & Reserve 🎉
              </button>
            </div>
          </div>
        )}

        {/* BOOKING SUCCESS */}
        {screen === SCREENS.BOOKING_SUCCESS && (
          <div className="flex flex-col items-center justify-center h-full" style={{ padding: "0 30px", textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 20, animation: "bounce 0.5s" }}>🎉</div>
            <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>You're In!</div>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 30 }}>Your reservation is confirmed</div>

            {bookings[0] && (
              <div style={{ background: "#0d0d0d", borderRadius: 20, border: "1px solid #1e1e1e", padding: 24, width: "100%", marginBottom: 30 }}>
                <div style={{ color: selectedVenue?.accent || "#C9A84C", fontSize: 24, fontWeight: 900, letterSpacing: 3, marginBottom: 4 }}>{bookings[0].venue}</div>
                <div style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>{bookings[0].date} · {bookings[0].party} guests</div>
                <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ color: "#555", fontSize: 11, letterSpacing: 2 }}>CONFIRMATION CODE</div>
                  <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: 6, marginTop: 4 }}>{bookings[0].confirmCode}</div>
                </div>
              </div>
            )}

            <button onClick={() => { setActiveTab("bookings"); goTo(SCREENS.MY_BOOKINGS); }} style={{ width: "100%", padding: "16px", borderRadius: 16, background: `linear-gradient(135deg, ${selectedVenue?.accent || "#C9A84C"}, ${selectedVenue?.accent || "#C9A84C"}bb)`, color: "#000", fontWeight: 800, fontSize: 15, letterSpacing: 1, border: "none", cursor: "pointer", marginBottom: 12, textTransform: "uppercase" }}>
              View My Bookings
            </button>
            <button onClick={() => { setActiveTab("discover"); goTo(SCREENS.DISCOVER); }} style={{ width: "100%", padding: "14px", borderRadius: 16, background: "transparent", color: "#555", fontWeight: 600, fontSize: 14, border: "1px solid #222", cursor: "pointer" }}>
              Back to Discover
            </button>
          </div>
        )}

        {/* MY BOOKINGS */}
        {screen === SCREENS.MY_BOOKINGS && (
          <div className="flex flex-col h-full">
            <div style={{ padding: "54px 20px 16px" }}>
              <div style={{ color: "#fff", fontSize: 26, fontWeight: 900 }}>My Reservations</div>
              <div style={{ color: "#555", fontSize: 13 }}>{bookings.length} upcoming</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 100px" }}>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🗓️</div>
                  <div style={{ color: "#555", fontSize: 16 }}>No reservations yet</div>
                  <button onClick={() => { setActiveTab("discover"); goTo(SCREENS.DISCOVER); }} style={{ marginTop: 20, padding: "12px 24px", borderRadius: 14, background: "#C9A84C", color: "#000", fontWeight: 700, border: "none", cursor: "pointer" }}>
                    Find a Club
                  </button>
                </div>
              ) : (
                bookings.map(b => (
                  <div key={b.id} style={{ background: "#0d0d0d", borderRadius: 18, border: "1px solid #1e1e1e", padding: 18, marginBottom: 14 }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div style={{ color: "#C9A84C", fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>{b.venue}</div>
                        <div style={{ color: "#555", fontSize: 12, marginTop: 3 }}>{b.table} · {b.date}</div>
                        <div style={{ color: "#444", fontSize: 12 }}>{b.party} guests</div>
                      </div>
                      <div style={{ background: "#4ade8020", border: "1px solid #4ade8055", borderRadius: 10, padding: "4px 10px" }}>
                        <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>CONFIRMED</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 14, background: "#1a1a1a", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: "#555", fontSize: 10, letterSpacing: 2 }}>CODE</div>
                        <div style={{ color: "#fff", fontSize: 16, fontWeight: 900, letterSpacing: 4 }}>{b.confirmCode}</div>
                      </div>
                      <div style={{ color: "#C9A84C", fontSize: 16, fontWeight: 700 }}>${b.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <BottomNav active={activeTab} onChange={t => {
              setActiveTab(t);
              if (t === "discover") goTo(SCREENS.DISCOVER);
              if (t === "owner") goTo(SCREENS.OWNER_DASHBOARD);
            }} />
          </div>
        )}

        {/* OWNER DASHBOARD */}
        {screen === SCREENS.OWNER_DASHBOARD && (
          <div className="flex flex-col h-full">
            <div style={{ padding: "54px 20px 16px" }}>
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Owner View</div>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>NOIR Dashboard</div>
              <div style={{ color: "#555", fontSize: 13 }}>Saturday, March 8 · Tonight</div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 100px" }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Reservations", value: "24", icon: "📋", color: "#C9A84C", change: "+6 vs last Sat" },
                  { label: "Projected Revenue", value: "$18,400", icon: "💰", color: "#4ade80", change: "+12% vs last Sat" },
                  { label: "Tables Booked", value: "6/8", icon: "🪑", color: "#818CF8", change: "2 available" },
                  { label: "Promoters Active", value: "4", icon: "🎤", color: "#F472B6", change: "3 online now" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#0d0d0d", borderRadius: 16, padding: "16px 14px", border: "1px solid #1a1a1a" }}>
                    <div style={{ fontSize: 22 }}>{s.icon}</div>
                    <div style={{ color: s.color, fontSize: 20, fontWeight: 900, marginTop: 6 }}>{s.value}</div>
                    <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{s.label}</div>
                    <div style={{ color: "#3a3a3a", fontSize: 9, marginTop: 4 }}>{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Tonight's Bookings */}
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Tonight's Reservations</div>
              {[
                { name: "James K.", table: "VIP 1", time: "10:30 PM", party: 6, status: "confirmed", spend: "$1,200" },
                { name: "Sofia R.", table: "Section A", time: "11:00 PM", party: 4, status: "confirmed", spend: "$600" },
                { name: "Marcus T.", table: "Booth 1", time: "11:30 PM", party: 5, status: "pending", spend: "$400" },
                { name: "Alicia M.", table: "Bar 1", time: "12:00 AM", party: 3, status: "confirmed", spend: "$200" },
              ].map((b, i) => (
                <div key={i} style={{ background: "#0d0d0d", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
                    <div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                      <div style={{ color: "#555", fontSize: 11 }}>{b.table} · {b.time} · {b.party} ppl</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>{b.spend}</div>
                    <div style={{ background: b.status === "confirmed" ? "#4ade8020" : "#F59E0B20", border: `1px solid ${b.status === "confirmed" ? "#4ade8055" : "#F59E0B55"}`, borderRadius: 8, padding: "2px 8px", marginTop: 4 }}>
                      <span style={{ color: b.status === "confirmed" ? "#4ade80" : "#F59E0B", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>{b.status}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promoter Performance */}
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginTop: 16, marginBottom: 10 }}>Promoter Performance</div>
              {[
                { name: "DJ Marcus", bookings: 8, revenue: "$4,200", badge: "🏆" },
                { name: "Lena V.", bookings: 6, revenue: "$3,100", badge: "⭐" },
                { name: "Rico T.", bookings: 5, revenue: "$2,800", badge: "⭐" },
              ].map((p, i) => (
                <div key={i} style={{ background: "#0d0d0d", borderRadius: 14, padding: "12px 16px", marginBottom: 8, border: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{p.badge}</span>
                    <div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: "#555", fontSize: 11 }}>{p.bookings} bookings tonight</div>
                    </div>
                  </div>
                  <div style={{ color: "#4ade80", fontSize: 14, fontWeight: 700 }}>{p.revenue}</div>
                </div>
              ))}
            </div>

            <BottomNav active={activeTab} onChange={t => {
              setActiveTab(t);
              if (t === "discover") goTo(SCREENS.DISCOVER);
              if (t === "bookings") goTo(SCREENS.MY_BOOKINGS);
            }} />
          </div>
        )}

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }
          @keyframes bounce { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
          @keyframes widthPulse { 0%,100%{opacity:0.3;width:20px} 50%{opacity:1;width:60px} }
          ::-webkit-scrollbar { display:none; }
        `}</style>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: "discover", icon: "🔍", label: "Discover" },
    { id: "bookings", icon: "🎟️", label: "My Bookings" },
    { id: "owner", icon: "📊", label: "Owner" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "#080808", borderTop: "1px solid #1a1a1a",
      padding: "10px 0 20px", display: "flex",
      backdropFilter: "blur(20px)",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: active === t.id ? "#C9A84C" : "#333", letterSpacing: 1, textTransform: "uppercase" }}>{t.label}</span>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: 2, background: "#C9A84C" }} />}
        </button>
      ))}
    </div>
  );
}
