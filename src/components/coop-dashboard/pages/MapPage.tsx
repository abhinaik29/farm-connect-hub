import { useState } from "react";
import { MAP_NODES } from "../data";

export function MapPage() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-lg">Geographical PostGIS Heatmap</h2>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        Active coordinate clusters, geo-fences, and village milk collection routes
      </p>
      <div className="relative mt-3 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted/40">
        <svg viewBox="0 0 100 62.5" className="h-full w-full">
          <defs>
            <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="var(--border)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="62.5" fill="url(#grid)" />
          {/* mock route lines connecting village nodes */}
          <polyline
            points={MAP_NODES.map((n) => `${n.x},${n.y}`).join(" ")}
            fill="none"
            stroke="var(--earth)"
            strokeWidth="0.5"
            strokeDasharray="1.5 1.5"
            opacity="0.5"
          />
          {MAP_NODES.map((n) => (
            <g
              key={n.label}
              onMouseEnter={() => setHoveredNode(n.label)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r / 2}
                fill={n.status === "flagged" ? "var(--destructive)" : "var(--primary)"}
                opacity="0.18"
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r / 5}
                fill={n.status === "flagged" ? "var(--destructive)" : "var(--primary)"}
                stroke="var(--card)"
                strokeWidth="0.6"
              />
            </g>
          ))}
        </svg>
        {hoveredNode && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-md">
            {hoveredNode}
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-3 rounded-lg border border-border bg-card/90 px-2.5 py-1.5 text-[10px] backdrop-blur">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" /> Reconciled node
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Flagged node
          </span>
        </div>
      </div>
    </section>
  );
}
