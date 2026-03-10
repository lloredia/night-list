import { useState, useEffect, useRef } from "react";
import {
  Building2,
  CreditCard,
  Bell,
  Clock,
  ShieldCheck,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
} from "lucide-react";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

type Tab = "venue" | "payments" | "notifications" | "hours" | "policies";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "venue", label: "Venue Profile", icon: Building2 },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "hours", label: "Hours", icon: Clock },
  { key: "policies", label: "Policies", icon: ShieldCheck },
];

const STORAGE_KEY = "nightlist_settings";

// ── Types ──────────────────────────────────────────────────────────────────

interface HourRow {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface CommissionTier {
  tier: string;
  rate: string;
  color: string;
  bg: string;
  border: string;
}

interface SettingsState {
  // Venue
  coverImage: string;
  venueName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  venueTypes: string[];
  // Notifications
  notifyNewBookings: boolean;
  notifyModifications: boolean;
  notifyPromoterActivity: boolean;
  notifyPaymentAlerts: boolean;
  emailWeeklySummary: boolean;
  emailMarketing: boolean;
  emailSecurityAlerts: boolean;
  // Hours
  hours: HourRow[];
  holidayOverride: boolean;
  earlyOpenPrivate: boolean;
  // Payments
  defaultMinSpend: string;
  vipMinSpend: string;
  commissionRates: CommissionTier[];
  // Policies
  maxPartySize: string;
  minAdvanceHrs: string;
  cancellationWindowHrs: string;
  noShowFeePct: string;
  dressCodes: boolean;
  ageVerification: boolean;
  guestListOnly: boolean;
  bottleServiceRequired: boolean;
  termsUrl: string;
  privacyUrl: string;
}

const defaultSettings: SettingsState = {
  coverImage: "",
  venueName: "NOIR",
  tagline: "Premium nightclub experience",
  description: "Manhattan's premier nightlife destination with world-class DJs and bottle service.",
  address: "47 W 20th St, New York, NY 10011",
  phone: "+1 (212) 555-0100",
  website: "https://noir.nightlist.com",
  instagram: "@noir_nyc",
  venueTypes: ["Nightclub", "Lounge"],
  notifyNewBookings: true,
  notifyModifications: true,
  notifyPromoterActivity: false,
  notifyPaymentAlerts: true,
  emailWeeklySummary: true,
  emailMarketing: false,
  emailSecurityAlerts: true,
  hours: [
    { day: "Monday",    open: "",         close: "",        closed: true },
    { day: "Tuesday",   open: "",         close: "",        closed: true },
    { day: "Wednesday", open: "10:00 PM", close: "3:00 AM", closed: false },
    { day: "Thursday",  open: "10:00 PM", close: "3:00 AM", closed: false },
    { day: "Friday",    open: "10:00 PM", close: "4:00 AM", closed: false },
    { day: "Saturday",  open: "10:00 PM", close: "4:00 AM", closed: false },
    { day: "Sunday",    open: "10:00 PM", close: "2:00 AM", closed: false },
  ],
  holidayOverride: true,
  earlyOpenPrivate: false,
  defaultMinSpend: "500",
  vipMinSpend: "2000",
  commissionRates: [
    { tier: "Gold",   rate: "15", color: "text-gold",      bg: "bg-gold/10",        border: "border-gold/20" },
    { tier: "Silver", rate: "12", color: "text-zinc-300",  bg: "bg-zinc-400/10",    border: "border-zinc-400/20" },
    { tier: "Bronze", rate: "10", color: "text-amber-600", bg: "bg-amber-600/10",   border: "border-amber-600/20" },
  ],
  maxPartySize: "20",
  minAdvanceHrs: "2",
  cancellationWindowHrs: "24",
  noShowFeePct: "50",
  dressCodes: true,
  ageVerification: true,
  guestListOnly: false,
  bottleServiceRequired: true,
  termsUrl: "https://noir.nightlist.com/terms",
  privacyUrl: "https://noir.nightlist.com/privacy",
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return defaultSettings;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function InputField({
  label,
  value,
  placeholder,
  type = "text",
  textarea = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      )}
    </div>
  );
}

function Toggle({
  value,
  label,
  description,
  onChange,
}: {
  value: boolean;
  label: string;
  description?: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors",
          value ? "bg-gold border-gold/50" : "bg-secondary border-border"
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white shadow transition-transform",
            value ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

// ── Tab panels ─────────────────────────────────────────────────────────────

function VenueProfile({
  s,
  set,
}: {
  s: SettingsState;
  set: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}) {
  const allTypes = ["Nightclub", "Lounge", "Rooftop", "Restaurant", "Bar"];

  function toggleType(t: string) {
    const next = s.venueTypes.includes(t)
      ? s.venueTypes.filter((x) => x !== t)
      : [...s.venueTypes, t];
    set("venueTypes", next);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("coverImage", reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div
        className="relative h-40 rounded-xl border border-border bg-secondary/30 overflow-hidden group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {s.coverImage ? (
          <img src={s.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <Camera className="h-8 w-8 mb-2 opacity-30" />
            <span className="text-xs">Click to upload cover image</span>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-card/80 border border-border text-xs text-foreground hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
        >
          <Upload className="h-3 w-3 inline mr-1" />
          {s.coverImage ? "Change" : "Upload"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Venue Name" value={s.venueName} onChange={(v) => set("venueName", v)} />
        <InputField label="Tagline" value={s.tagline} onChange={(v) => set("tagline", v)} />
      </div>
      <InputField label="Description" value={s.description} textarea onChange={(v) => set("description", v)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Address" value={s.address} onChange={(v) => set("address", v)} />
        <InputField label="Phone" value={s.phone} type="tel" onChange={(v) => set("phone", v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Website" value={s.website} onChange={(v) => set("website", v)} />
        <InputField label="Instagram" value={s.instagram} onChange={(v) => set("instagram", v)} />
      </div>

      {/* Venue Type Tags */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Venue Type
        </label>
        <div className="flex flex-wrap gap-2">
          {allTypes.map((t) => {
            const active = s.venueTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-medium border transition-colors",
                  active
                    ? "border-gold/30 bg-gold/10 text-gold"
                    : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Payments({
  s,
  set,
}: {
  s: SettingsState;
  set: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}) {
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
        <MetalButton variant="default">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          Dashboard
        </MetalButton>
      </div>

      {/* Commission Rates */}
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Commission Rates</h4>
        <div className="space-y-3">
          {s.commissionRates.map((c, i) => (
            <div
              key={c.tier}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
            >
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                  c.bg,
                  c.border,
                  c.color
                )}
              >
                {c.tier}
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={c.rate}
                  onChange={(e) => {
                    const updated = s.commissionRates.map((r, idx) =>
                      idx === i ? { ...r, rate: e.target.value } : r
                    );
                    set("commissionRates", updated);
                  }}
                  className="w-14 h-8 rounded-lg border border-border bg-background px-2 text-sm font-bold text-foreground text-right focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Spend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Default Min. Spend"
          value={s.defaultMinSpend}
          type="number"
          onChange={(v) => set("defaultMinSpend", v)}
        />
        <InputField
          label="VIP Min. Spend"
          value={s.vipMinSpend}
          type="number"
          onChange={(v) => set("vipMinSpend", v)}
        />
      </div>
    </div>
  );
}

function Notifications({
  s,
  set,
}: {
  s: SettingsState;
  set: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground">Push Notifications</h4>
        <Toggle value={s.notifyNewBookings} label="New Bookings" description="Get notified when a new reservation is created" onChange={(v) => set("notifyNewBookings", v)} />
        <Toggle value={s.notifyModifications} label="Booking Modifications" description="Alert when guests modify or cancel" onChange={(v) => set("notifyModifications", v)} />
        <Toggle value={s.notifyPromoterActivity} label="Promoter Activity" description="Notifications when promoters create booking links" onChange={(v) => set("notifyPromoterActivity", v)} />
        <Toggle value={s.notifyPaymentAlerts} label="Payment Alerts" description="Receive alerts for payouts and commission charges" onChange={(v) => set("notifyPaymentAlerts", v)} />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
        <Toggle value={s.emailWeeklySummary} label="Weekly Summary" description="Receive a weekly digest of bookings and revenue" onChange={(v) => set("emailWeeklySummary", v)} />
        <Toggle value={s.emailMarketing} label="Marketing Updates" description="Product updates and feature announcements" onChange={(v) => set("emailMarketing", v)} />
        <Toggle value={s.emailSecurityAlerts} label="Security Alerts" description="Login attempts from new devices" onChange={(v) => set("emailSecurityAlerts", v)} />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">APNs Configuration</h4>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-gold" />
          <span className="text-xs text-muted-foreground">
            Push certificate will be auto-configured when app is published to App Store.
          </span>
        </div>
      </div>
    </div>
  );
}

function Hours({
  s,
  set,
}: {
  s: SettingsState;
  set: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}) {
  function updateHour(index: number, field: keyof HourRow, value: string | boolean) {
    const updated = s.hours.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    set("hours", updated);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
        <div className="p-5 pb-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Operating Hours</h4>
        </div>
        <div className="divide-y divide-border/50">
          {s.hours.map((d, i) => (
            <div key={d.day} className="flex items-center gap-3 px-5 py-3">
              <span className="text-sm font-medium text-foreground w-24 shrink-0">{d.day}</span>

              {/* Closed toggle */}
              <button
                onClick={() => updateHour(i, "closed", !d.closed)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
                  d.closed ? "bg-secondary border-border" : "bg-gold border-gold/50"
                )}
              >
                <span
                  className={cn(
                    "block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
                    d.closed ? "translate-x-0.5" : "translate-x-[18px]"
                  )}
                />
              </button>
              <span className="text-xs text-muted-foreground w-8 shrink-0">
                {d.closed ? "Closed" : "Open"}
              </span>

              {!d.closed && (
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="text"
                    value={d.open}
                    placeholder="10:00 PM"
                    onChange={(e) => updateHour(i, "open", e.target.value)}
                    className="w-24 h-8 rounded-lg border border-border bg-secondary/30 px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 text-center"
                  />
                  <span className="text-muted-foreground text-xs">–</span>
                  <input
                    type="text"
                    value={d.close}
                    placeholder="4:00 AM"
                    onChange={(e) => updateHour(i, "close", e.target.value)}
                    className="w-24 h-8 rounded-lg border border-border bg-secondary/30 px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 text-center"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Special Events</h4>
        <Toggle value={s.holidayOverride} label="Holiday Hours Override" description="Automatically extend hours on holidays" onChange={(v) => set("holidayOverride", v)} />
        <Toggle value={s.earlyOpenPrivate} label="Early Open for Private Events" description="Allow early entry for special bookings" onChange={(v) => set("earlyOpenPrivate", v)} />
      </div>
    </div>
  );
}

function Policies({
  s,
  set,
}: {
  s: SettingsState;
  set: <K extends keyof SettingsState>(k: K, v: SettingsState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Booking Rules</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Max Party Size" value={s.maxPartySize} type="number" onChange={(v) => set("maxPartySize", v)} />
          <InputField label="Min Advance Booking (hrs)" value={s.minAdvanceHrs} type="number" onChange={(v) => set("minAdvanceHrs", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Cancellation Window (hrs)" value={s.cancellationWindowHrs} type="number" onChange={(v) => set("cancellationWindowHrs", v)} />
          <InputField label="No-Show Fee (%)" value={s.noShowFeePct} type="number" onChange={(v) => set("noShowFeePct", v)} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
        <h4 className="text-sm font-semibold text-foreground">House Rules</h4>
        <Toggle value={s.dressCodes} label="Dress Code Enforced" description="Smart casual minimum — no athletic wear or sandals" onChange={(v) => set("dressCodes", v)} />
        <Toggle value={s.ageVerification} label="Age Verification" description="21+ with valid government-issued ID" onChange={(v) => set("ageVerification", v)} />
        <Toggle value={s.guestListOnly} label="Guest List Only" description="Only allow entry for guests with reservations" onChange={(v) => set("guestListOnly", v)} />
        <Toggle value={s.bottleServiceRequired} label="Bottle Service Required (VIP)" description="VIP tables require minimum bottle purchase" onChange={(v) => set("bottleServiceRequired", v)} />
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Legal</h4>
        <InputField label="Terms of Service URL" value={s.termsUrl} onChange={(v) => set("termsUrl", v)} />
        <InputField label="Privacy Policy URL" value={s.privacyUrl} onChange={(v) => set("privacyUrl", v)} />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("venue");
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Persist on load so defaults are written if nothing exists yet
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    }
  }, []);

  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
  }

  const panels: Record<Tab, React.ReactNode> = {
    venue: <VenueProfile s={settings} set={set} />,
    payments: <Payments s={settings} set={set} />,
    notifications: <Notifications s={settings} set={set} />,
    hours: <Hours s={settings} set={set} />,
    policies: <Policies s={settings} set={set} />,
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Venue profile, payments, and policies.</p>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="text-xs text-muted-foreground">Saved {savedAt}</span>
            )}
            <MetalButton variant="gold" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </MetalButton>
          </div>
        </header>

        <div className="flex gap-6">
          {/* Tab Nav — desktop */}
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

          {/* Tab Nav — mobile */}
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
