import { useState } from "react";
import {
  Building2,
  CreditCard,
  Bell,
  Clock,
  ShieldCheck,
  Globe,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Upload,
  Camera,
} from "lucide-react";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

type Tab = "venue" | "payments" | "notifications" | "hours" | "policies";

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: "venue", label: "Venue Profile", icon: Building2 },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "hours", label: "Hours", icon: Clock },
  { key: "policies", label: "Policies", icon: ShieldCheck },
];

function InputField({ label, value, placeholder, type = "text", textarea = false }: { label: string; value?: string; placeholder?: string; type?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
        />
      ) : (
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="w-full h-10 rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      )}
    </div>
  );
}

function Toggle({ enabled, label, description }: { enabled: boolean; label: string; description?: string }) {
  const [on, setOn] = useState(enabled);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors", on ? "bg-gold border-gold/50" : "bg-secondary border-border")}
      >
        <span className={cn("block h-4 w-4 rounded-full bg-white shadow transition-transform", on ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

function VenueProfile() {
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-40 rounded-xl border border-border bg-secondary/30 overflow-hidden group">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <Camera className="h-8 w-8 mb-2 opacity-30" />
          <span className="text-xs">Upload Cover Image</span>
        </div>
        <button className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-card/80 border border-border text-xs text-foreground hover:bg-card transition-colors opacity-0 group-hover:opacity-100">
          <Upload className="h-3 w-3 inline mr-1" />
          Change
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Venue Name" value="NOIR" />
        <InputField label="Tagline" value="Premium nightclub experience" />
      </div>
      <InputField label="Description" value="Manhattan's premier nightlife destination with world-class DJs and bottle service." textarea />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Address" value="47 W 20th St, New York, NY 10011" />
        <InputField label="Phone" value="+1 (212) 555-0100" type="tel" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Website" value="https://noir.nightlist.com" />
        <InputField label="Instagram" value="@noir_nyc" />
      </div>

      {/* Venue Type Tags */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Venue Type</label>
        <div className="flex flex-wrap gap-2">
          {["Nightclub", "Lounge", "Rooftop", "Restaurant", "Bar"].map((t, i) => (
            <span
              key={t}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                i < 2
                  ? "border-gold/30 bg-gold/10 text-gold"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Payments() {
  return (
    <div className="space-y-6">
      {/* Stripe Status */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-500/10 p-3">
            <CreditCard className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Stripe Connect</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Connected</span>
            </div>
          </div>
        </div>
        <MetalButton variant="default" size="sm">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Dashboard
        </MetalButton>
      </div>

      {/* Payout Info */}
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Payout Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-lg font-bold text-foreground mt-1">Weekly</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-xs text-muted-foreground">Next Payout</p>
            <p className="text-lg font-bold text-gold mt-1">$4,280.00</p>
          </div>
        </div>
      </div>

      {/* Commission */}
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Commission Rates</h4>
        <div className="space-y-3">
          {[
            { tier: "Gold", rate: "15%", color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
            { tier: "Silver", rate: "12%", color: "text-zinc-300", bg: "bg-zinc-400/10", border: "border-zinc-400/20" },
            { tier: "Bronze", rate: "10%", color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20" },
          ].map((c) => (
            <div key={c.tier} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
              <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border", c.bg, c.border, c.color)}>
                {c.tier}
              </span>
              <span className="text-sm font-bold text-foreground font-tabular">{c.rate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Spend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Default Min. Spend" value="500" type="number" />
        <InputField label="VIP Min. Spend" value="2000" type="number" />
      </div>
    </div>
  );
}

function Notifications() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground">Push Notifications</h4>
        <Toggle enabled={true} label="New Bookings" description="Get notified when a new reservation is created" />
        <Toggle enabled={true} label="Booking Modifications" description="Alert when guests modify or cancel" />
        <Toggle enabled={false} label="Promoter Activity" description="Notifications when promoters create booking links" />
        <Toggle enabled={true} label="Payment Alerts" description="Receive alerts for payouts and commission charges" />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
        <Toggle enabled={true} label="Weekly Summary" description="Receive a weekly digest of bookings and revenue" />
        <Toggle enabled={false} label="Marketing Updates" description="Product updates and feature announcements" />
        <Toggle enabled={true} label="Security Alerts" description="Login attempts from new devices" />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">APNs Configuration</h4>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-gold" />
          <span className="text-xs text-muted-foreground">Push certificate will be auto-configured when app is published to App Store.</span>
        </div>
      </div>
    </div>
  );
}

function Hours() {
  const days = [
    { day: "Monday", open: "Closed", close: "", closed: true },
    { day: "Tuesday", open: "Closed", close: "", closed: true },
    { day: "Wednesday", open: "10:00 PM", close: "3:00 AM", closed: false },
    { day: "Thursday", open: "10:00 PM", close: "3:00 AM", closed: false },
    { day: "Friday", open: "10:00 PM", close: "4:00 AM", closed: false },
    { day: "Saturday", open: "10:00 PM", close: "4:00 AM", closed: false },
    { day: "Sunday", open: "10:00 PM", close: "2:00 AM", closed: false },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
        <div className="p-5 pb-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Operating Hours</h4>
        </div>
        <div className="divide-y divide-border/50">
          {days.map((d) => (
            <div key={d.day} className="flex items-center justify-between px-5 py-3.5">
              <span className={cn("text-sm font-medium", d.closed ? "text-muted-foreground" : "text-foreground")}>
                {d.day}
              </span>
              {d.closed ? (
                <span className="text-xs text-muted-foreground/50 font-medium">Closed</span>
              ) : (
                <div className="flex items-center gap-2 text-sm font-tabular">
                  <span className="text-foreground/80">{d.open}</span>
                  <span className="text-muted-foreground">–</span>
                  <span className="text-foreground/80">{d.close}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Special Events</h4>
        <Toggle enabled={true} label="Holiday Hours Override" description="Automatically extend hours on holidays" />
        <Toggle enabled={false} label="Early Open for Private Events" description="Allow early entry for special bookings" />
      </div>
    </div>
  );
}

function Policies() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Booking Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Max Party Size" value="20" type="number" />
          <InputField label="Min Advance Booking (hrs)" value="2" type="number" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Cancellation Window (hrs)" value="24" type="number" />
          <InputField label="No-Show Fee (%)" value="50" type="number" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground">House Rules</h4>
        <Toggle enabled={true} label="Dress Code Enforced" description="Smart casual minimum — no athletic wear or sandals" />
        <Toggle enabled={true} label="Age Verification" description="21+ with valid government-issued ID" />
        <Toggle enabled={false} label="Guest List Only" description="Only allow entry for guests with reservations" />
        <Toggle enabled={true} label="Bottle Service Required (VIP)" description="VIP tables require minimum bottle purchase" />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Legal</h4>
        <InputField label="Terms of Service URL" value="https://noir.nightlist.com/terms" />
        <InputField label="Privacy Policy URL" value="https://noir.nightlist.com/privacy" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("venue");

  const panels: Record<Tab, JSX.Element> = {
    venue: <VenueProfile />,
    payments: <Payments />,
    notifications: <Notifications />,
    hours: <Hours />,
    policies: <Policies />,
  };

  return (
    <div className="h-[calc(100vh-0px)] overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Venue profile, payments, and policies.</p>
          </div>
          <MetalButton variant="gold">
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </MetalButton>
        </header>

        <div className="flex gap-6">
          {/* Tab Nav */}
          <div className="hidden md:block w-52 shrink-0">
            <nav className="space-y-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                      activeTab === t.key
                        ? "bg-gold/10 text-gold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex gap-1 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  activeTab === t.key ? "bg-gold/10 text-gold" : "text-muted-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{panels[activeTab]}</div>
        </div>
      </div>
    </div>
  );
}
