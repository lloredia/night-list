import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const weekData = [
  { day: "Mon", revenue: 8200, bookings: 14 },
  { day: "Tue", revenue: 6100, bookings: 11 },
  { day: "Wed", revenue: 9400, bookings: 18 },
  { day: "Thu", revenue: 11200, bookings: 22 },
  { day: "Fri", revenue: 16800, bookings: 31 },
  { day: "Sat", revenue: 18400, bookings: 24 },
  { day: "Sun", revenue: 7200, bookings: 13 },
];

const recentBookings = [
  { name: "James K.", table: "VIP 1", time: "10:30 PM", party: 6, spend: 1200, status: "confirmed" },
  { name: "Sofia R.", table: "Section A", time: "11:00 PM", party: 4, spend: 600, status: "confirmed" },
  { name: "Marcus T.", table: "Booth 1", time: "11:30 PM", party: 5, spend: 400, status: "pending" },
  { name: "Alicia M.", table: "Bar 1", time: "12:00 AM", party: 3, spend: 200, status: "confirmed" },
  { name: "Darius F.", table: "VIP 2", time: "10:00 PM", party: 8, spend: 1500, status: "confirmed" },
];

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

const statusStyles = {
  confirmed: "bg-green-500/10 text-green-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function DashboardHome() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8">
        <div>
          <div className="text-[#555] text-xs tracking-widest uppercase mb-1">Tonight at NOIR</div>
          <h1 className="text-3xl font-black text-white">{todayLabel}</h1>
          <p className="text-[#444] text-sm mt-1">Doors open 9PM · Closes 4AM</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#111] border border-[#222] rounded-xl text-sm text-[#666] hover:text-white transition-colors">Export Report</button>
          <button className="px-4 py-2 bg-[#C9A84C] rounded-xl text-sm font-bold text-black">+ Add Booking</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "📋", label: "Reservations", value: "24", change: "+6 vs last Sat", color: "#C9A84C" },
          { icon: "💰", label: "Projected Revenue", value: "$18,400", change: "+12% vs last Sat", color: "#4ade80" },
          { icon: "🪑", label: "Tables Filled", value: "6 / 8", change: "2 still available", color: "#818CF8" },
          { icon: "🎤", label: "Promoters", value: "4 active", change: "3 online now", color: "#F472B6" },
        ].map(s => (
          <div key={s.label} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className="font-black text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[#555] text-xs uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-[#333] text-xs">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="text-[#555] text-xs tracking-widest uppercase mb-1">This Week</div>
          <div className="text-white font-bold text-lg mb-4">Revenue Overview</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} barSize={20}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 10, color: "#fff" }} formatter={v => ["$" + v.toLocaleString(), "Revenue"]} />
              <Bar dataKey="revenue" fill="#C9A84C" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="text-[#555] text-xs tracking-widest uppercase mb-1">This Week</div>
          <div className="text-white font-bold text-lg mb-4">Booking Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weekData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 10, color: "#fff" }} />
              <Line type="monotone" dataKey="bookings" stroke="#818CF8" strokeWidth={2} dot={{ fill: "#818CF8", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tonight's Bookings Table */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="text-[#555] text-xs tracking-widest uppercase mb-1">Tonight</div>
            <div className="text-white font-bold text-lg">Live Reservations</div>
          </div>
          <button className="text-[#C9A84C] text-sm font-semibold">View All →</button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[640px] space-y-2">
            {/* Header */}
            <div className="grid grid-cols-5 text-[10px] text-[#333] uppercase tracking-widest pb-2 border-b border-[#111] px-3">
              <span>Guest</span><span>Table</span><span>Time</span><span>Party</span><span className="text-right">Spend</span>
            </div>
            {recentBookings.map((b) => (
              <div key={`${b.name}-${b.table}-${b.time}`} className="grid grid-cols-5 items-center px-3 py-3 rounded-xl hover:bg-[#111] transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs">👤</div>
                  <span className="text-white text-sm font-semibold">{b.name}</span>
                </div>
                <span className="text-[#666] text-sm">{b.table}</span>
                <span className="text-[#666] text-sm">{b.time}</span>
                <span className="text-[#666] text-sm">{b.party} ppl</span>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-[#C9A84C] font-bold">${b.spend.toLocaleString()}</span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-lg ${statusStyles[b.status] || statusStyles.pending}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
