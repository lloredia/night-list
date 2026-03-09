import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  CalendarDays,
  Users,
  DollarSign,
} from "lucide-react";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  id: string;
  guest: string;
  email: string;
  table: string;
  tableType: string;
  date: string;
  time: string;
  party: number;
  spend: number;
  status: BookingStatus;
  promoter: string;
  notes: string;
}

const allBookings: Booking[] = [
  { id: "NL-001", guest: "James K.", email: "james@email.com", table: "VIP 1", tableType: "vip", date: "Mar 8", time: "10:30 PM", party: 6, spend: 1200, status: "confirmed", promoter: "DJ Marcus", notes: "Birthday celebration" },
  { id: "NL-002", guest: "Sofia R.", email: "sofia@email.com", table: "Section A", tableType: "premium", date: "Mar 8", time: "11:00 PM", party: 4, spend: 600, status: "confirmed", promoter: "Lena V.", notes: "" },
  { id: "NL-003", guest: "Marcus T.", email: "marcus@email.com", table: "Booth 1", tableType: "booth", date: "Mar 8", time: "11:30 PM", party: 5, spend: 400, status: "pending", promoter: "Rico T.", notes: "First time guest" },
  { id: "NL-004", guest: "Alicia M.", email: "alicia@email.com", table: "Bar 1", tableType: "bar", date: "Mar 8", time: "12:00 AM", party: 3, spend: 200, status: "confirmed", promoter: "—", notes: "" },
  { id: "NL-005", guest: "Darius F.", email: "darius@email.com", table: "VIP 2", tableType: "vip", date: "Mar 8", time: "10:00 PM", party: 8, spend: 1500, status: "confirmed", promoter: "DJ Marcus", notes: "Corporate event" },
  { id: "NL-006", guest: "Nina P.", email: "nina@email.com", table: "Section B", tableType: "premium", date: "Mar 8", time: "11:00 PM", party: 6, spend: 750, status: "pending", promoter: "Lena V.", notes: "" },
  { id: "NL-007", guest: "Tyler W.", email: "tyler@email.com", table: "Booth 2", tableType: "booth", date: "Mar 9", time: "10:30 PM", party: 4, spend: 400, status: "confirmed", promoter: "Rico T.", notes: "" },
  { id: "NL-008", guest: "Jasmine L.", email: "jasmine@email.com", table: "VIP 1", tableType: "vip", date: "Mar 9", time: "11:00 PM", party: 10, spend: 2000, status: "cancelled", promoter: "DJ Marcus", notes: "Cancelled — rescheduling" },
];

const statusConfig: Record<BookingStatus, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  confirmed: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

const tableTypeColors: Record<string, string> = {
  vip: "text-gold bg-gold/10 border-gold/20",
  premium: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  booth: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  bar: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

const filters = ["All", "Confirmed", "Pending", "Cancelled"] as const;

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allBookings.filter((b) => {
    const matchesFilter =
      activeFilter === "All" || b.status === activeFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      b.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.promoter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const totalSpend = allBookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.spend, 0);

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Bookings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all reservations for tonight and upcoming dates.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
            <Download className="h-4 w-4" />
            Export
          </button>
          <MetalButton variant="gold">Guest List</MetalButton>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Confirmed", value: confirmedCount, icon: CalendarDays, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Pending", value: pendingCount, icon: Users, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Total Revenue", value: `$${totalSpend.toLocaleString()}`, icon: DollarSign, color: "text-gold", bg: "bg-gold/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4">
              <div className={cn("rounded-lg p-2.5", s.bg)}>
                <Icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold font-tabular text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search guest, table, promoter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all"
          />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl border border-border bg-card/30">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeFilter === f
                  ? "bg-gold/15 text-gold border border-gold/20"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "Guest", "Table", "Date / Time", "Party", "Promoter", "Spend", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className={cn(
                        "text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-3 px-4",
                        h === "Spend" || h === "Status" ? "text-center" : "text-left"
                      )}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const StatusIcon = statusConfig[b.status].icon;
                return (
                  <tr
                    key={b.id}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-muted-foreground">{b.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground">
                          {b.guest.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{b.guest}</p>
                          <p className="text-[11px] text-muted-foreground">{b.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border",
                          tableTypeColors[b.tableType]
                        )}
                      >
                        {b.table}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm text-foreground/80 font-tabular">{b.date}</p>
                      <p className="text-[11px] text-muted-foreground font-tabular">{b.time}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-foreground/70 font-tabular">{b.party} ppl</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-foreground/70">{b.promoter}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-gold font-tabular">
                        ${b.spend.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-1 rounded-md border",
                          statusConfig[b.status].bg
                        )}
                      >
                        <StatusIcon className={cn("h-3 w-3", statusConfig[b.status].color)} />
                        <span className={statusConfig[b.status].color}>{b.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-secondary">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No bookings match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
