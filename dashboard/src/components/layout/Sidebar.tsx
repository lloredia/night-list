import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  Map,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "floorplan", label: "Floor Plan", icon: Map },
  { id: "promoters", label: "Promoters", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]",
        "hidden md:flex"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20">
          <Moon className="h-4 w-4 text-gold" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
              Night<span className="text-gold">List</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Owner Portal
            </p>
          </div>
        )}
      </div>

      {/* Active Venue Card */}
      {!collapsed && (
        <div className="mx-3 mt-4 rounded-xl border border-border bg-secondary/50 p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Active Venue
          </p>
          <p className="text-sm font-semibold text-foreground tracking-tight">NOIR</p>
          <p className="text-xs text-muted-foreground">Manhattan, NY</p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/50" />
            <span className="text-[10px] text-emerald-400 font-medium">Open Tonight</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-2 space-y-0.5">
        {NAV.map((item) => {
          const active = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                active
                  ? "bg-gold/10 text-gold border border-gold/20 shadow-[0_0_12px_-3px] shadow-gold/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  active ? "text-gold" : "text-muted-foreground"
                )}
              />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px] shadow-gold/60" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-2">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User */}
      <div
        className={cn(
          "flex items-center gap-3 border-t border-border px-4 py-4",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20">
          <span className="text-xs font-semibold text-gold">N</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate">Club Owner</p>
            <p className="text-[11px] text-muted-foreground truncate">owner@noir.com</p>
          </div>
        )}
      </div>
    </aside>
  );
}
