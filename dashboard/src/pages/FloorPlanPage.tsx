import { useEffect, useMemo, useRef, useState } from "react";
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
  Undo2,
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

interface Fixture {
  id: string;
  label: string;
  type: "stage" | "dance" | "bar";
  x: number;
  y: number;
  w: number;
  h: number;
}

type TableType = Table["type"];
type FixtureType = Fixture["type"];

const CANVAS_WIDTH = 460;
const CANVAS_HEIGHT = 440;
const GRID_SIZE = 12;
const STORAGE_KEY = "nightlist.floorplan.layout.v2";
const LEGACY_STORAGE_KEY = "nightlist.floorplan.layout.v1";

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

const initialFixtures: Fixture[] = [
  { id: "F1", label: "Stage / DJ", type: "stage", x: 140, y: 16, w: 180, h: 48 },
  { id: "F2", label: "Dance Floor", type: "dance", x: 160, y: 76, w: 140, h: 40 },
  { id: "F3", label: "Bar", type: "bar", x: 20, y: 386, w: 420, h: 40 },
];

const typeColors: Record<TableType, { fill: string; border: string; text: string; label: string }> = {
  vip: { fill: "rgba(201,168,76,0.15)", border: "#C9A84C", text: "#C9A84C", label: "VIP" },
  premium: { fill: "rgba(124,58,237,0.15)", border: "#7C3AED", text: "#A78BFA", label: "Premium" },
  booth: { fill: "rgba(5,150,105,0.15)", border: "#059669", text: "#34D399", label: "Booth" },
  bar: { fill: "rgba(8,145,178,0.15)", border: "#0891B2", text: "#22D3EE", label: "Bar" },
};

export default function FloorPlanPage() {
  const [initialLayout] = useState(loadStoredLayout);
  const [tables, setTables] = useState<Table[]>(initialLayout.tables);
  const [fixtures, setFixtures] = useState<Fixture[]>(initialLayout.fixtures);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<{ tables: Table[]; fixtures: Fixture[] } | null>(null);
  const isFirstRender = useRef(true);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    kind: "table" | "fixture";
    id: string;
    pointerOffsetX: number;
    pointerOffsetY: number;
  } | null>(null);

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId) ?? null,
    [tables, selectedTableId]
  );
  const selectedFixture = useMemo(
    () => fixtures.find((fixture) => fixture.id === selectedFixtureId) ?? null,
    [fixtures, selectedFixtureId]
  );

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;

      const point = pointerToCanvas(canvasRef.current, event.clientX, event.clientY);
      if (!point) return;

      if (drag.kind === "table") {
        setTables((previous) =>
          previous.map((table) => {
            if (table.id !== drag.id) return table;

            const nextX = snapToGrid(point.x - drag.pointerOffsetX);
            const nextY = snapToGrid(point.y - drag.pointerOffsetY);
            const clampedX = clamp(nextX, 0, CANVAS_WIDTH - table.w);
            const clampedY = clamp(nextY, 0, CANVAS_HEIGHT - table.h);

            if (clampedX === table.x && clampedY === table.y) return table;
            return { ...table, x: clampedX, y: clampedY };
          })
        );
      } else {
        setFixtures((previous) =>
          previous.map((fixture) => {
            if (fixture.id !== drag.id) return fixture;

            const nextX = snapToGrid(point.x - drag.pointerOffsetX);
            const nextY = snapToGrid(point.y - drag.pointerOffsetY);
            const clampedX = clamp(nextX, 0, CANVAS_WIDTH - fixture.w);
            const clampedY = clamp(nextY, 0, CANVAS_HEIGHT - fixture.h);

            if (clampedX === fixture.x && clampedY === fixture.y) return fixture;
            return { ...fixture, x: clampedX, y: clampedY };
          })
        );
      }
    }

    function onPointerUp() {
      dragRef.current = null;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsDirty(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables, fixtures }));
      setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      setIsDirty(false);
    }, 2000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [tables, fixtures]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;

      if (event.key === "Escape") {
        setSelectedTableId(null);
        setSelectedFixtureId(null);
      }
      if ((event.key === "Delete" || event.key === "Backspace") && selectedTableId) {
        setTables((prev) => prev.filter((t) => t.id !== selectedTableId));
        setSelectedTableId(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedTableId]);

  const updateSelectedTable = (patch: Partial<Table>) => {
    if (!selectedTableId) return;

    setTables((previous) =>
      previous.map((table) => {
        if (table.id !== selectedTableId) return table;
        return normalizeTable({ ...table, ...patch });
      })
    );
  };

  const updateSelectedFixture = (patch: Partial<Fixture>) => {
    if (!selectedFixtureId) return;

    setFixtures((previous) =>
      previous.map((fixture) => {
        if (fixture.id !== selectedFixtureId) return fixture;
        return normalizeFixture({ ...fixture, ...patch });
      })
    );
  };

  const onTablePointerDown = (table: Table, event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const point = pointerToCanvas(canvasRef.current, event.clientX, event.clientY);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    setSelectedTableId(table.id);
    setSelectedFixtureId(null);

    dragRef.current = {
      kind: "table",
      id: table.id,
      pointerOffsetX: point.x - table.x,
      pointerOffsetY: point.y - table.y,
    };
  };

  const onFixturePointerDown = (
    fixture: Fixture,
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.button !== 0) return;

    const point = pointerToCanvas(canvasRef.current, event.clientX, event.clientY);
    if (!point) return;

    event.preventDefault();
    event.stopPropagation();
    setSelectedFixtureId(fixture.id);
    setSelectedTableId(null);

    dragRef.current = {
      kind: "fixture",
      id: fixture.id,
      pointerOffsetX: point.x - fixture.x,
      pointerOffsetY: point.y - fixture.y,
    };
  };

  const onDeleteSelected = () => {
    if (!selectedTableId) return;
    setTables((previous) => previous.filter((table) => table.id !== selectedTableId));
    setSelectedTableId(null);
  };

  const onDeleteSelectedFixture = () => {
    if (!selectedFixtureId) return;
    setFixtures((previous) => previous.filter((f) => f.id !== selectedFixtureId));
    setSelectedFixtureId(null);
  };

  const onDiscardChanges = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (lastSaved) {
      setTables(lastSaved.tables);
      setFixtures(lastSaved.fixtures);
    } else {
      setTables(initialTables);
      setFixtures(initialFixtures);
    }
    setIsDirty(false);
    setSelectedTableId(null);
    setSelectedFixtureId(null);
  };

  const onAddFixture = (type: FixtureType) => {
    const nextIndex = nextFixtureIndex(fixtures);
    const defaults: Record<FixtureType, { label: string; w: number; h: number }> = {
      stage: { label: "Stage / DJ", w: 180, h: 48 },
      dance: { label: "Dance Floor", w: 140, h: 40 },
      bar:   { label: "Bar",         w: 420, h: 40 },
    };
    const { label, w, h } = defaults[type];
    const newFixture = normalizeFixture({
      id: `F${nextIndex}`,
      label,
      type,
      x: 80,
      y: 120,
      w,
      h,
    });
    setFixtures((previous) => [...previous, newFixture]);
    setSelectedFixtureId(newFixture.id);
    setSelectedTableId(null);
  };

  const onAddTable = (type: TableType = "vip") => {
    const nextIndex = nextTableIndex(tables);

    const newTable = normalizeTable({
      id: `T${nextIndex}`,
      label: `${typeColors[type].label} ${nextIndex}`,
      type,
      x: 36 + ((nextIndex * 20) % 260),
      y: 120 + ((nextIndex * 16) % 220),
      w: 84,
      h: 56,
      price: 500,
      capacity: 6,
      available: true,
    });

    setTables((previous) => [...previous, newTable]);
    setSelectedTableId(newTable.id);
    setSelectedFixtureId(null);
  };

  const onSaveLayout = () => {
    if (typeof window === "undefined") return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables, fixtures }));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    setLastSaved({ tables, fixtures });
    setIsDirty(false);
  };

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Floor Plan Builder</h1>
            <p className="text-xs text-muted-foreground">Drag any element to position. Click to configure.</p>
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
            {isDirty && (
              <button
                onClick={onDiscardChanges}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Discard
              </button>
            )}
            <MetalButton variant="gold" onClick={onSaveLayout}>
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
          <div className="mx-auto mb-3 flex w-full max-w-[560px] items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Drag tables, stage, dance floor, or bar. Values snap to a {GRID_SIZE}px grid.
            </p>
            {isDirty ? (
              <p className="text-xs text-amber-400/80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                Unsaved changes
              </p>
            ) : savedAt ? (
              <p className="text-xs text-emerald-400/80">Saved at {savedAt}</p>
            ) : (
              <p className="text-xs text-muted-foreground/70">Not saved yet</p>
            )}
          </div>
          <div
            className="relative mx-auto"
            style={{
              width: CANVAS_WIDTH * zoom,
              height: CANVAS_HEIGHT * zoom,
            }}
          >
            <div
              ref={canvasRef}
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedTableId(null);
                  setSelectedFixtureId(null);
                }
              }}
              className="relative rounded-2xl border border-border bg-card/30 overflow-hidden"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
            {/* Grid */}
            {showGrid && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
                <defs>
                  <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                    <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}

            {/* Fixtures */}
            {fixtures.map((fixture) => {
              const isSelected = selectedFixtureId === fixture.id;

              return (
                <div
                  key={fixture.id}
                  onPointerDown={(event) => onFixturePointerDown(fixture, event)}
                  className={cn(
                    "absolute cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
                    fixture.type === "dance"
                      ? "flex items-center justify-center rounded-lg border border-dashed border-white/10"
                      : "flex items-center justify-center gap-2 rounded-xl border",
                    fixture.type === "stage" && "border-white/10 bg-white/[0.03]",
                    fixture.type === "bar" && "border-cyan-500/20 bg-cyan-500/5",
                    isSelected && "ring-2 ring-offset-2 ring-offset-card ring-sky-400/70"
                  )}
                  style={{
                    left: fixture.x,
                    top: fixture.y,
                    width: fixture.w,
                    height: fixture.h,
                    boxShadow: isSelected ? "0 0 20px rgba(56,189,248,0.25)" : "none",
                  }}
                >
                  {fixture.type === "stage" ? (
                    <>
                      <Music className="h-4 w-4 text-white/30" />
                      <span className="text-xs font-medium text-white/40">{fixture.label}</span>
                    </>
                  ) : fixture.type === "bar" ? (
                    <>
                      <Wine className="h-4 w-4 text-cyan-400/60" />
                      <span className="text-xs font-semibold text-cyan-400/70">{fixture.label}</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-medium text-white/20">{fixture.label}</span>
                  )}
                </div>
              );
            })}

            {/* Tables */}
            {tables.map((table) => {
              const colors = typeColors[table.type];
              const isSelected = selectedTableId === table.id;
              return (
                <div
                  key={table.id}
                  onPointerDown={(event) => onTablePointerDown(table, event)}
                  className={cn(
                    "absolute rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 flex flex-col items-center justify-center select-none",
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
                      ? `0 6px 12px ${colors.border}20`
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
      </div>

      {/* Properties Panel */}
      <div className="w-[280px] border-l border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            Properties
          </h2>
        </div>

        {selectedTable ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Table Info */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border",
                    tableTypeColors(selectedTable.type)
                  )}
                >
                  {selectedTable.type}
                </span>
                <span className="text-xs text-muted-foreground">{selectedTable.id}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{selectedTable.label}</p>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Label
              </label>
              <input
                type="text"
                value={selectedTable.label}
                onChange={(event) => updateSelectedTable({ label: event.target.value.slice(0, 30) })}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Type
              </label>
              <select
                value={selectedTable.type}
                onChange={(event) =>
                  updateSelectedTable({ type: event.target.value as TableType })
                }
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                {Object.entries(typeColors).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fields */}
            {[
              { label: "Price ($)", value: selectedTable.price },
              { label: "Capacity", value: selectedTable.capacity },
              { label: "X Position", value: selectedTable.x },
              { label: "Y Position", value: selectedTable.y },
              { label: "Width", value: selectedTable.w },
              { label: "Height", value: selectedTable.h },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    if (!Number.isFinite(nextValue)) return;

                    if (field.label === "Price ($)") updateSelectedTable({ price: Math.max(0, nextValue) });
                    if (field.label === "Capacity") updateSelectedTable({ capacity: Math.max(1, nextValue) });
                    if (field.label === "X Position") updateSelectedTable({ x: nextValue });
                    if (field.label === "Y Position") updateSelectedTable({ y: nextValue });
                    if (field.label === "Width") updateSelectedTable({ w: nextValue });
                    if (field.label === "Height") updateSelectedTable({ h: nextValue });
                  }}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground font-tabular focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            ))}

            {/* Availability Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-2">
                {selectedTable.available ? (
                  <Unlock className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Lock className="h-4 w-4 text-red-400" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {selectedTable.available ? "Available" : "Booked"}
                </span>
              </div>
              <button
                onClick={() => {
                  setTables((prev) =>
                    prev.map((t) =>
                      t.id === selectedTable.id ? { ...t, available: !t.available } : t
                    )
                  );
                }}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  selectedTable.available ? "bg-emerald-500" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                    selectedTable.available ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={onDeleteSelected}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Remove Table
            </button>
          </div>
        ) : selectedFixture ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border text-sky-300 bg-sky-400/10 border-sky-400/30">
                  {selectedFixture.type}
                </span>
                <span className="text-xs text-muted-foreground">{selectedFixture.id}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{selectedFixture.label}</p>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Label
              </label>
              <input
                type="text"
                value={selectedFixture.label}
                onChange={(event) => updateSelectedFixture({ label: event.target.value.slice(0, 30) })}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            {[
              { label: "X Position", value: selectedFixture.x },
              { label: "Y Position", value: selectedFixture.y },
              { label: "Width", value: selectedFixture.w },
              { label: "Height", value: selectedFixture.h },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    if (!Number.isFinite(nextValue)) return;

                    if (field.label === "X Position") updateSelectedFixture({ x: nextValue });
                    if (field.label === "Y Position") updateSelectedFixture({ y: nextValue });
                    if (field.label === "Width") updateSelectedFixture({ w: nextValue });
                    if (field.label === "Height") updateSelectedFixture({ h: nextValue });
                  }}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground font-tabular focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            ))}

            <button
              onClick={onDeleteSelectedFixture}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Remove Fixture
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Move className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">Select an element to edit</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Click any table, stage, dance floor, or bar</p>
          </div>
        )}

        {/* Add Table */}
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="h-3 w-3" />
            Add Table
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.entries(typeColors) as [TableType, typeof typeColors[TableType]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => onAddTable(key)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all"
              >
                <div className="h-2 w-2 rounded-sm flex-shrink-0" style={{ background: val.border }} />
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Fixture */}
        <div className="px-4 pb-4 space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="h-3 w-3" />
            Add Fixture
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {(["stage", "dance", "bar"] as FixtureType[]).map((type) => (
              <button
                key={type}
                onClick={() => onAddFixture(type)}
                className="flex items-center justify-center rounded-lg border border-border bg-card/50 px-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all capitalize"
              >
                {type}
              </button>
            ))}
          </div>
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function normalizeTable(table: Table): Table {
  const w = clamp(Math.round(table.w), 40, CANVAS_WIDTH);
  const h = clamp(Math.round(table.h), 32, CANVAS_HEIGHT);

  return {
    ...table,
    x: clamp(Math.round(table.x), 0, CANVAS_WIDTH - w),
    y: clamp(Math.round(table.y), 0, CANVAS_HEIGHT - h),
    w,
    h,
    price: Math.max(0, Math.round(table.price)),
    capacity: Math.max(1, Math.round(table.capacity)),
  };
}

function normalizeFixture(fixture: Fixture): Fixture {
  const w = clamp(Math.round(fixture.w), 60, CANVAS_WIDTH);
  const h = clamp(Math.round(fixture.h), 28, CANVAS_HEIGHT);

  return {
    ...fixture,
    x: clamp(Math.round(fixture.x), 0, CANVAS_WIDTH - w),
    y: clamp(Math.round(fixture.y), 0, CANVAS_HEIGHT - h),
    w,
    h,
  };
}

function nextTableIndex(tables: Table[]) {
  const currentMax = tables.reduce((max, table) => {
    const numericId = Number(table.id.replace(/^\D+/, ""));
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);
  return currentMax + 1;
}

function nextFixtureIndex(fixtures: Fixture[]) {
  const currentMax = fixtures.reduce((max, fixture) => {
    const numericId = Number(fixture.id.replace(/^\D+/, ""));
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);
  return currentMax + 1;
}

function pointerToCanvas(
  canvas: HTMLDivElement | null,
  clientX: number,
  clientY: number
) {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  const scaleX = rect.width / CANVAS_WIDTH;
  const scaleY = rect.height / CANVAS_HEIGHT;

  return {
    x: (clientX - rect.left) / scaleX,
    y: (clientY - rect.top) / scaleY,
  };
}

function loadStoredLayout(): { tables: Table[]; fixtures: Fixture[] } {
  if (typeof window === "undefined") {
    return { tables: initialTables, fixtures: initialFixtures };
  }

  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return { tables: initialTables, fixtures: initialFixtures };
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const legacyTables = parsed
        .map(coerceStoredTable)
        .filter((table): table is Table => table !== null)
        .map((table) => normalizeTable(table));
      return {
        tables: legacyTables.length > 0 ? legacyTables : initialTables,
        fixtures: initialFixtures,
      };
    }

    if (!parsed || typeof parsed !== "object") {
      return { tables: initialTables, fixtures: initialFixtures };
    }

    const tableList = Array.isArray(parsed.tables) ? parsed.tables : [];
    const fixtureList = Array.isArray(parsed.fixtures) ? parsed.fixtures : [];

    const loadedTables = tableList
      .map(coerceStoredTable)
      .filter((table): table is Table => table !== null)
      .map((table) => normalizeTable(table));
    const loadedFixtures = fixtureList.filter(isStoredFixture).map((fixture) => normalizeFixture(fixture));

    return {
      tables: loadedTables.length > 0 ? loadedTables : initialTables,
      fixtures: loadedFixtures.length > 0 ? loadedFixtures : initialFixtures,
    };
  } catch {
    return { tables: initialTables, fixtures: initialFixtures };
  }
}

function isTableType(value: unknown): value is TableType {
  return value === "vip" || value === "premium" || value === "booth" || value === "bar";
}

function isFixtureType(value: unknown): value is FixtureType {
  return value === "stage" || value === "dance" || value === "bar";
}

function coerceStoredTable(item: unknown): Table | null {
  if (!item || typeof item !== "object") return null;

  const value = item as Record<string, unknown>;
  const rawType = value.type;
  const mappedType =
    rawType === "couch" ? "booth" : rawType;

  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    !isTableType(mappedType) ||
    typeof value.x !== "number" ||
    typeof value.y !== "number" ||
    typeof value.w !== "number" ||
    typeof value.h !== "number" ||
    typeof value.price !== "number" ||
    typeof value.capacity !== "number" ||
    typeof value.available !== "boolean"
  ) {
    return null;
  }

  return {
    id: value.id,
    label: value.label,
    type: mappedType,
    x: value.x,
    y: value.y,
    w: value.w,
    h: value.h,
    price: value.price,
    capacity: value.capacity,
    available: value.available,
  };
}

function isStoredFixture(item: unknown): item is Fixture {
  if (!item || typeof item !== "object") return false;

  const value = item as Record<string, unknown>;

  return (
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    isFixtureType(value.type) &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.w === "number" &&
    typeof value.h === "number"
  );
}
