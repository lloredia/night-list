import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  CalendarCheck,
  DollarSign,
  Users,
  Armchair,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Download,
  Plus,
  Sparkles,
} from "lucide-react";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

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
  { name: "James K.", table: "VIP 1", time: "10:30 PM", party: 6, spend: 1200, status: "confirmed" as const, promoter: "DJ Marcus" },
  { name: "Sofia R.", table: "Section A", time: "11:00 PM", party: 4, spend: 600, status: "confirmed" as const, promoter: "Lena V." },
  { name: "Marcus T.", table: "Booth 1", time: "11:30 PM", party: 5, spend: 400, status: "pending" as const, promoter: "Rico T." },
  { name: "Alicia M.", table: "Bar 1", time: "12:00 AM", party: 3, spend: 200, status: "confirmed" as const, promoter: "—" },
  { name: "Darius F.", table: "VIP 2", time: "10:00 PM", party: 8, spend: 1500, status: "confirmed" as const, promoter: "DJ Marcus" },
];

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATS = [
  {
    label: "Reservations",
    value: "24",
    change: "+6",
    changeLabel: "vs last Sat",
    trend: "up" as const,
    icon: CalendarCheck,
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/20",
  },
  {
    label: "Projected Revenue",
    value: "$18,400",
    change: "+12%",
    changeLabel: "vs last Sat",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-500/20",
  },
  {
    label: "Tables Filled",
    value: "6 / 8",
    change: "2",
    changeLabel: "available",
    trend: "neutral" as const,
    icon: Armchair,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-500/20",
  },
  {
    label: "Active Promoters",
    value: "4",
    change: "3",
    changeLabel: "online",
    trend: "up" as const,
    icon: Users,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-500/20",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {payload.map((item: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: item.color }}>
            {item.name === "revenue"
              ? `$${Number(item.value).toLocaleString()}`
              : item.value}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {item.name === "revenue" ? "revenue" : "bookings"}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardHome() {
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                Live Tonight
              </span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {todayLabel}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Doors 9 PM — Closes 4 AM
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all">
            <Download className="h-4 w-4" />
            Export
          </button>
          <MetalButton variant="gold">
            <Plus className="h-4 w-4 mr-1" />
            Add Booking
          </MetalButton>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-card/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/20",
                s.borderColor
              )}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.02] to-transparent" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("rounded-lg p-2", s.bgColor)}>
                    <Icon className={cn("h-4 w-4", s.color)} />
                  </div>
                  {s.trend === "up" && (
                    <div className="flex items-center gap-0.5 text-emerald-400">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">{s.change}</span>
                    </div>
                  )}
                  {s.trend === "neutral" && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {s.change} {s.changeLabel}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold font-tabular text-foreground mb-0.5">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.label}
                  {s.trend === "up" && (
                    <span className="text-muted-foreground/60 ml-1">{s.changeLabel}</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
                This Week
              </p>
              <h2 className="text-lg font-semibold text-foreground">Revenue</h2>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">+18%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} barSize={20} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(240 5% 45%)", fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(240 4% 8%)" }} />
              <Bar dataKey="revenue" fill="#C9A84C" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="rounded-xl border border-border bg-card/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
                This Week
              </p>
              <h2 className="text-lg font-semibold text-foreground">Bookings</h2>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">133 total</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(240 5% 45%)", fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#818cf8"
                strokeWidth={2}
                fill="url(#bookingGradient)"
                dot={{ fill: "#818cf8", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#818cf8", stroke: "#1e1b4b", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Reservations Table */}
      <section className="rounded-xl border border-border bg-card/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
              Tonight
            </p>
            <h2 className="text-lg font-semibold text-foreground">Reservations</h2>
          </div>
          <button className="text-gold text-sm font-medium hover:text-gold/80 transition-colors flex items-center gap-1">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto p-6 pt-4">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                {["Guest", "Table", "Time", "Party", "Promoter", "Spend"].map(
                  (h) => (
                    <th
                      key={h}
                      className={cn(
                        "text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-3 px-3",
                        h === "Spend" ? "text-right" : "text-left"
                      )}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr
                  key={`${b.name}-${b.table}`}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground">
                        {b.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {b.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm text-foreground/70 font-tabular">
                      {b.table}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm text-foreground/70 font-tabular">
                      {b.time}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm text-foreground/70 font-tabular">
                      {b.party} ppl
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm text-foreground/70">{b.promoter}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-semibold text-gold font-tabular mr-3">
                      ${b.spend.toLocaleString()}
                    </span>
                    <span
                      className={cn(
                        "inline-flex text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md",
                        statusStyles[b.status]
                      )}
                    >
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
