import { useState } from "react";
import {
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  Settings2,
  Lock,
  Unlock,
  Music,
  Wine,
  Grid3X3,
} from "lucide-react";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

interface Table {
  id: string;
  label: string;
  type: "vip" | "premium" | "booth" | "bar";
  x: number;
  y: number;
  w: number;
  h: number;
  price: number;
  capacity: number;
  available: boolean;
}

const initialTables: Table[] = [
  { id: "T1", label: "VIP 1", type: "vip", x: 80, y: 100, w: 90, h: 60, price: 1200, capacity: 8, available: true },
  { id: "T2", label: "VIP 2", type: "vip", x: 260, y: 100, w: 90, h: 60, price: 1500, capacity: 10, available: false },
  { id: "T3", label: "Section A", type: "premium", x: 80, y: 220, w: 75, h: 55, price: 600, capacity: 6, available: true },
  { id: "T4", label: "Section B", type: "premium", x: 190, y: 220, w: 75, h: 55, price: 600, capacity: 6, available: true },
  { id: "T5", label: "Section C", type: "premium", x: 300, y: 220, w: 75, h: 55, price: 750, capacity: 6, available: false },
  { id: "T6", label: "Bar 1", type: "bar", x: 80, y: 340, w: 60, h: 45, price: 200, capacity: 4, available: true },
  { id: "T7", label: "Bar 2", type: "bar", x: 160, y: 340, w: 60, h: 45, price: 200, capacity: 4, available: true },
  { id: "T8", label: "Booth 1", type: "booth", x: 270, y: 330, w: 70, h: 50, price: 400, capacity: 5, available: true },
];

const typeColors: Record<string, { fill: string; border: string; text: string; label: string }> = {
  vip: { fill: "rgba(201,168,76,0.15)", border: "#C9A84C", text: "#C9A84C", label: "VIP" },
  premium: { fill: "rgba(124,58,237,0.15)", border: "#7C3AED", text: "#A78BFA", label: "Premium" },
  booth: { fill: "rgba(5,150,105,0.15)", border: "#059669", text: "#34D399", label: "Booth" },
  bar: { fill: "rgba(8,145,178,0.15)", border: "#0891B2", text: "#22D3EE", label: "Bar" },
};

export default function FloorPlanPage() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const selected = tables.find((t) => t.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Floor Plan Builder</h1>
            <p className="text-xs text-muted-foreground">Drag tables to position. Click to configure.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded-lg border transition-all",
                showGrid ? "border-gold/30 bg-gold/10 text-gold" : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 border border-border rounded-lg bg-card/50 p-0.5">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono text-muted-foreground w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => setZoom(1)} className="p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground transition-all">
              <RotateCcw className="h-4 w-4" />
            </button>
            <MetalButton variant="gold">
              <Save className="h-4 w-4 mr-1" />
              Save Layout
            </MetalButton>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 border-b border-border/50 bg-card/30 px-6 py-2">
          {Object.entries(typeColors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ background: val.border }} />
              <span className="text-[11px] font-medium text-muted-foreground">{val.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-white/10" />
            <span className="text-[11px] font-medium text-muted-foreground">Booked</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-background p-8">
          <div
            className="relative mx-auto rounded-2xl border border-border bg-card/30 overflow-hidden"
            style={{
              width: 460 * zoom,
              height: 440 * zoom,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              minWidth: 460,
              minHeight: 440,
            }}
          >
            {/* Grid */}
            {showGrid && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
                <defs>
                  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}

            {/* Stage */}
            <div
              className="absolute flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03]"
              style={{ left: "50%", transform: "translateX(-50%)", top: 16, width: 180, height: 48 }}
            >
              <Music className="h-4 w-4 text-white/30" />
              <span className="text-xs font-medium text-white/40">Stage / DJ</span>
            </div>

            {/* Dance Floor */}
            <div
              className="absolute flex items-center justify-center rounded-lg border border-dashed border-white/10"
              style={{ left: "50%", transform: "translateX(-50%)", top: 76, width: 140, height: 40 }}
            >
              <span className="text-[10px] font-medium text-white/20">Dance Floor</span>
            </div>

            {/* Bar */}
            <div
              className="absolute flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5"
              style={{ bottom: 14, left: 20, right: 20, height: 40 }}
            >
              <Wine className="h-4 w-4 text-cyan-400/60" />
              <span className="text-xs font-semibold text-cyan-400/70">Bar</span>
            </div>

            {/* Tables */}
            {tables.map((table) => {
              const colors = typeColors[table.type];
              const isSelected = selectedId === table.id;
              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedId(table.id)}
                  className={cn(
                    "absolute rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center",
                    isSelected && "ring-2 ring-offset-2 ring-offset-card shadow-lg",
                    !table.available && "opacity-40"
                  )}
                  style={{
                    left: table.x,
                    top: table.y,
                    width: table.w,
                    height: table.h,
                    background: table.available ? colors.fill : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${table.available ? colors.border : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isSelected
                      ? `0 0 20px ${colors.border}40`
                      : table.available
                      ? `0 0 10px ${colors.border}20`
                      : "none",
                    ringColor: colors.border,
                  }}
                >
                  {table.available ? (
                    <>
                      <span className="text-[10px] font-bold" style={{ color: colors.text }}>
                        {table.label}
                      </span>
                      <span className="text-[9px] font-medium" style={{ color: colors.text, opacity: 0.6 }}>
                        ${table.price}
                      </span>
                    </>
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-white/20" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-[280px] border-l border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            Properties
          </h2>
        </div>

        {selected ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Table Info */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border",
                    tableTypeColors(selected.type)
                  )}
                >
                  {selected.type}
                </span>
                <span className="text-xs text-muted-foreground">{selected.id}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{selected.label}</p>
            </div>

            {/* Fields */}
            {[
              { label: "Price ($)", value: selected.price },
              { label: "Capacity", value: selected.capacity },
              { label: "X Position", value: selected.x },
              { label: "Y Position", value: selected.y },
              { label: "Width", value: selected.w },
              { label: "Height", value: selected.h },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  {field.label}
                </label>
                <input
                  type="number"
                  defaultValue={field.value}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground font-tabular focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            ))}

            {/* Availability Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-2">
                {selected.available ? (
                  <Unlock className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Lock className="h-4 w-4 text-red-400" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {selected.available ? "Available" : "Booked"}
                </span>
              </div>
              <button
                onClick={() => {
                  setTables((prev) =>
                    prev.map((t) =>
                      t.id === selected.id ? { ...t, available: !t.available } : t
                    )
                  );
                }}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  selected.available ? "bg-emerald-500" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                    selected.available ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* Delete */}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              <Trash2 className="h-4 w-4" />
              Remove Table
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Move className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">Select a table to edit</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Click on any table in the floor plan</p>
          </div>
        )}

        {/* Add Table */}
        <div className="p-4 border-t border-border">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all">
            <Plus className="h-4 w-4" />
            Add Table
          </button>
        </div>
      </div>
    </div>
  );
}

function tableTypeColors(type: string): string {
  const map: Record<string, string> = {
    vip: "text-gold bg-gold/10 border-gold/20",
    premium: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    booth: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    bar: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  };
  return map[type] || "";
}
