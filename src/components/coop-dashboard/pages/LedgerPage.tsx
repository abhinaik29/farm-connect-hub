import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "../components/StatusPill";
import { VILLAGE_NODES, fmt } from "../data";

export function LedgerPage() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="font-display text-lg">Village AMCU Node Ledger</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node ID</TableHead>
              <TableHead>Village</TableHead>
              <TableHead className="text-right">Telemetry (L)</TableHead>
              <TableHead className="text-right">Tanker (L)</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead className="text-right">Herd</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VILLAGE_NODES.map((v) => {
              const variance = ((v.tankerWeighInL - v.amcuTelemetryL) / v.amcuTelemetryL) * 100;
              return (
                <TableRow key={v.id} className={v.status === "flagged" ? "bg-destructive/5" : undefined}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{v.id}</TableCell>
                  <TableCell className="font-medium">{v.village}</TableCell>
                  <TableCell className="text-right">{fmt(v.amcuTelemetryL)}</TableCell>
                  <TableCell className="text-right">{fmt(v.tankerWeighInL)}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${Math.abs(variance) >= 2 ? "text-destructive" : "text-primary"}`}
                  >
                    {variance > 0 ? "+" : ""}
                    {variance.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">{fmt(v.herd)}</TableCell>
                  <TableCell>
                    <StatusPill status={v.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
