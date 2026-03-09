import { useState } from "react";
import {
  Crown,
  Star,
  Link2,
  Copy,
  TrendingUp,
  DollarSign,
  CalendarCheck,
  Users,
  MoreHorizontal,
  Plus,
  Mail,
  Phone,
  ExternalLink,
  Search,
  Award,
} from "lucide-react";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

interface Promoter {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  tier: "gold" | "silver" | "bronze";
  bookings: number;
  revenue: number;
  commission: number;
  commissionRate: number;
  link: string;
  online: boolean;
  topVenue: string;
  joinDate: string;
}

const promoters: Promoter[] = [
  {
    id: "P1", name: "DJ Marcus", avatar: "M", email: "marcus@nightlist.com", phone: "+1 (212) 555-0101",
    tier: "gold", bookings: 48, revenue: 24200, commission: 3630, commissionRate: 15,
    link: "noir.nightlist.com/r/djmarcus", online: true, topVenue: "NOIR", joinDate: "Jan 2026",
  },
  {
    id: "P2", name: "Lena V.", avatar: "L", email: "lena@nightlist.com", phone: "+1 (212) 555-0102",
    tier: "gold", bookings: 36, revenue: 18100, commission: 2715, commissionRate: 15,
    link: "noir.nightlist.com/r/lenav", online: true, topVenue: "NOIR", joinDate: "Feb 2026",
  },
  {
    id: "P3", name: "Rico T.", avatar: "R", email: "rico@nightlist.com", phone: "+1 (212) 555-0103",
    tier: "silver", bookings: 28, revenue: 12800, commission: 1536, commissionRate: 12,
    link: "noir.nightlist.com/r/ricot", online: true, topVenue: "NOIR", joinDate: "Feb 2026",
  },
  {
    id: "P4", name: "Ava Chen", avatar: "A", email: "ava@nightlist.com", phone: "+1 (212) 555-0104",
    tier: "silver", bookings: 19, revenue: 8400, commission: 1008, commissionRate: 12,
    link: "noir.nightlist.com/r/avachen", online: false, topVenue: "NOIR", joinDate: "Mar 2026",
  },
  {
    id: "P5", name: "Kai Jordan", avatar: "K", email: "kai@nightlist.com", phone: "+1 (212) 555-0105",
    tier: "bronze", bookings: 11, revenue: 4200, commission: 420, commissionRate: 10,
    link: "noir.nightlist.com/r/kaijordan", online: false, topVenue: "NOIR", joinDate: "Mar 2026",
  },
];

const tierConfig = {
  gold: { color: "text-gold", bg: "bg-gold/10", border: "border-gold/20", icon: Crown, label: "Gold" },
  silver: { color: "text-zinc-300", bg: "bg-zinc-400/10", border: "border-zinc-400/20", icon: Star, label: "Silver" },
  bronze: { color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20", icon: Award, label: "Bronze" },
};

export default function PromotersPage() {
  const [selectedId, setSelectedId] = useState<string | null>("P1");
  const [searchQuery, setSearchQuery] = useState("");
  const selected = promoters.find((p) => p.id === selectedId);

  const totalRevenue = promoters.reduce((s, p) => s + p.revenue, 0);
  const totalBookings = promoters.reduce((s, p) => s + p.bookings, 0);
  const onlineCount = promoters.filter((p) => p.online).length;

  const filtered = promoters.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Left: List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 md:p-8 pb-0">
          <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Promoters</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage accounts, links, and commissions.
              </p>
            </div>
            <MetalButton variant="gold">
              <Plus className="h-4 w-4 mr-1" />
              Invite Promoter
            </MetalButton>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "Total Bookings", value: totalBookings.toString(), icon: CalendarCheck, color: "text-gold", bg: "bg-gold/10" },
              { label: "Online Now", value: `${onlineCount} / ${promoters.length}`, icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
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

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search promoters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        {/* Promoter List */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8">
          <div className="space-y-2">
            {filtered.map((p) => {
              const tier = tierConfig[p.tier];
              const TierIcon = tier.icon;
              const isActive = selectedId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    isActive
                      ? "border-gold/30 bg-gold/5 shadow-[0_0_15px_-5px] shadow-gold/10"
                      : "border-border bg-card/50 hover:bg-secondary/30"
                  )}
                >
                  {/* Avatar */}
                  <div className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border", tier.bg, tier.border)}>
                    <span className={cn("text-sm font-bold", tier.color)}>{p.avatar}</span>
                    {p.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                      <TierIcon className={cn("h-3.5 w-3.5 shrink-0", tier.color)} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {p.bookings} bookings · ${p.revenue.toLocaleString()} revenue
                    </p>
                  </div>

                  {/* Commission */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-400 font-tabular">
                      ${p.commission.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">earned</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className="w-[320px] border-l border-border bg-card/50 flex flex-col overflow-y-auto">
        {selected ? (
          <>
            {/* Profile Header */}
            <div className="p-6 border-b border-border text-center">
              <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 mb-3", tierConfig[selected.tier].bg, tierConfig[selected.tier].border)}>
                <span className={cn("text-2xl font-bold", tierConfig[selected.tier].color)}>{selected.avatar}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border", tierConfig[selected.tier].bg, tierConfig[selected.tier].border, tierConfig[selected.tier].color)}>
                  {React.createElement(tierConfig[selected.tier].icon, { className: "h-3 w-3" })}
                  {tierConfig[selected.tier].label}
                </span>
                {selected.online && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md">
                    Online
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 p-6 border-b border-border">
              {[
                { label: "Bookings", value: selected.bookings.toString(), color: "text-gold" },
                { label: "Revenue", value: `$${selected.revenue.toLocaleString()}`, color: "text-emerald-400" },
                { label: "Commission", value: `$${selected.commission.toLocaleString()}`, color: "text-purple-400" },
                { label: "Rate", value: `${selected.commissionRate}%`, color: "text-indigo-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <p className={cn("text-lg font-bold font-tabular", s.color)}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="p-6 border-b border-border space-y-3">
              <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Contact</h4>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80 truncate">{selected.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80">{selected.phone}</span>
              </div>
            </div>

            {/* Referral Link */}
            <div className="p-6 border-b border-border">
              <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Referral Link</h4>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-2.5">
                <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground/70 font-mono truncate flex-1">{selected.link}</span>
                <button className="p-1 rounded hover:bg-secondary transition-colors">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="p-6">
              <p className="text-xs text-muted-foreground">
                Member since <span className="text-foreground/70">{selected.joinDate}</span>
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Users className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">Select a promoter</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Need React for createElement
import React from "react";
