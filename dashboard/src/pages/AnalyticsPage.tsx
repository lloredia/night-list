import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CalendarCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const revenueData = [
  { month: "Jan", revenue: 8200, bookings: 22 },
  { month: "Feb", revenue: 14500, bookings: 38 },
  { month: "Mar", revenue: 18100, bookings: 46 },
  { month: "Apr", revenue: 22300, bookings: 58 },
  { month: "May", revenue: 19800, bookings: 52 },
  { month: "Jun", revenue: 28400, bookings: 72 },
  { month: "Jul", revenue: 32100, bookings: 82 },
];

const weeklyData = [
  { day: "Mon", guests: 45, revenue: 1200 },
  { day: "Tue", guests: 62, revenue: 1800 },
  { day: "Wed", guests: 58, revenue: 1600 },
  { day: "Thu", guests: 120, revenue: 4200 },
  { day: "Fri", guests: 285, revenue: 9800 },
  { day: "Sat", guests: 340, revenue: 12400 },
  { day: "Sun", guests: 180, revenue: 5600 },
];

const hourlyData = [
  { hour: "8pm", guests: 12 }, { hour: "9pm", guests: 38 },
  { hour: "10pm", guests: 85 }, { hour: "11pm", guests: 142 },
  { hour: "12am", guests: 180 }, { hour: "1am", guests: 155 },
  { hour: "2am", guests: 90 }, { hour: "3am", guests: 30 },
];

const tableTypeData = [
  { name: "VIP", value: 38, color: "#C9A84C" },
  { name: "Premium", value: 28, color: "#818cf8" },
  { name: "Booth", value: 22, color: "#34d399" },
  { name: "Bar", value: 12, color: "#f97316" },
];

const promoterROI = [
  { name: "DJ Marcus", bookings: 48, revenue: 24200, commission: 3630, roi: 567 },
  { name: "Lena V.", bookings: 36, revenue: 18100, commission: 2715, roi: 567 },
  { name: "Rico T.", bookings: 28, revenue: 12800, commission: 1536, roi: 733 },
  { name: "Ava Chen", bookings: 19, revenue: 8400, commission: 1008, roi: 733 },
  { name: "Kai Jordan", bookings: 11, revenue: 4200, commission: 420, roi: 900 },
];

const ChartTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("revenue")
            ? `$${p.value.toLocaleString()}`
            : String(p.value ?? "").toLocaleString()}
        </p>
      ))}
    </div>
  );
};

type TimeRange = "7d" | "30d" | "90d";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const stats = [
    { label: "Total Revenue", value: "$143,400", change: "+18.2%", trend: "up", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Bookings", value: "370", change: "+12.5%", trend: "up", icon: CalendarCheck, color: "text-gold", bg: "bg-gold/10" },
    { label: "Avg. Party Size", value: "4.8", change: "+0.3", trend: "up", icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Avg. Spend / Table", value: "$388", change: "-2.1%", trend: "down", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="h-[calc(100vh-0px)] overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">Revenue trends, peak hours, and promoter ROI.</p>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card/50 p-1">
            {(["7d", "30d", "90d"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  timeRange === r ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            const TrendIcon = s.trend === "up" ? ArrowUpRight : ArrowDownRight;
            const trendColor = s.trend === "up" ? "text-emerald-400" : "text-red-400";
            return (
              <div key={s.label} className="rounded-xl border border-border bg-card/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("rounded-lg p-2", s.bg)}>
                    <Icon className={cn("h-4 w-4", s.color)} />
                  </div>
                  <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trendColor)}>
                    <TrendIcon className="h-3 w-3" />
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground font-tabular">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue + Bookings Chart */}
        <div className="rounded-xl border border-border bg-card/50 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue & Bookings Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v / 1000}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area name="Revenue" type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revGrad)" />
                <Area name="Bookings" type="monotone" dataKey="bookings" stroke="#818cf8" strokeWidth={2} fill="url(#bookGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row: Weekly + Hourly + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weekly */}
          <div className="rounded-xl border border-border bg-card/50 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Revenue</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar name="Revenue" dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly */}
          <div className="rounded-xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-semibold text-foreground">Peak Hours</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area name="Guests" type="monotone" dataKey="guests" stroke="#34d399" strokeWidth={2} fill="url(#hourGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Types Pie */}
          <div className="rounded-xl border border-border bg-card/50 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Table Type Split</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tableTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {tableTypeData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {tableTypeData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-muted-foreground">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promoter ROI Table */}
        <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
          <div className="p-5 pb-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Promoter ROI</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Revenue generated vs. commission paid</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Promoter", "Bookings", "Revenue", "Commission", "ROI"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promoterROI.map((p) => (
                  <tr key={p.name} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-5 py-3 text-muted-foreground font-tabular">{p.bookings}</td>
                    <td className="px-5 py-3 text-emerald-400 font-bold font-tabular">${p.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gold font-tabular">${p.commission.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="text-emerald-400 font-bold font-tabular">{p.roi}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
