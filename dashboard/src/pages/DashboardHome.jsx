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
  confirmed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATS = [
  { label: "Reservations", value: "24", change: "+6 vs last Sat", color: "var(--accent)" },
  { label: "Projected Revenue", value: "$18,400", change: "+12% vs last Sat", color: "#22c55e" },
  { label: "Tables Filled", value: "6 / 8", change: "2 available", color: "#818cf8" },
  { label: "Promoters", value: "4 active", change: "3 online", color: "#a78bfa" },
];

export default function DashboardHome() {
  return (
    <div className="p-6 md:p-8 max-w-[1600px]">
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8">
        <div>
          <p className="text-[var(--text-muted)] text-xs font-medium tracking-wide uppercase mb-1">Tonight at NOIR</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">{todayLabel}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Doors 9PM · Closes 4AM</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)] transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-[var(--accent)] rounded-[var(--radius)] text-sm font-semibold text-black hover:opacity-90 transition-opacity">
            Add booking
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
            <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-bold font-tabular mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[var(--text-tertiary)] text-xs font-tabular">{s.change}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wide mb-1">This week</p>
          <h2 className="text-[var(--text-primary)] font-semibold text-lg mb-4">Revenue</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} barSize={16} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12 }} formatter={(v) => ["$" + Number(v).toLocaleString(), "Revenue"]} />
              <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wide mb-1">This week</p>
          <h2 className="text-[var(--text-primary)] font-semibold text-lg mb-4">Bookings</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weekData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12 }} />
              <Line type="monotone" dataKey="bookings" stroke="#818cf8" strokeWidth={2} dot={{ fill: "#818cf8", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wide mb-1">Tonight</p>
            <h2 className="text-[var(--text-primary)] font-semibold text-lg">Reservations</h2>
          </div>
          <button className="text-[var(--accent)] text-sm font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider py-3 px-3">Guest</th>
                <th className="text-left text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider py-3 px-3">Table</th>
                <th className="text-left text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider py-3 px-3">Time</th>
                <th className="text-left text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider py-3 px-3">Party</th>
                <th className="text-right text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider py-3 px-3">Spend</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={`${b.name}-${b.table}-${b.time}`} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-xs font-medium text-[var(--text-muted)]">
                        {b.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[var(--text-primary)] text-sm">{b.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[var(--text-secondary)] text-sm font-tabular">{b.table}</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)] text-sm font-tabular">{b.time}</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)] text-sm font-tabular">{b.party} ppl</td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-semibold text-[var(--accent)] font-tabular mr-2">${b.spend.toLocaleString()}</span>
                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-md ${statusStyles[b.status] || statusStyles.pending}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
