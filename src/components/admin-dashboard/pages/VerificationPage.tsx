import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionCard } from "../components/SectionCard";
import { CopyButton } from "../components/CopyButton";
import { VERIFICATION_STREAM } from "../data";

export function VerificationPage() {
  return (
    <SectionCard title="Verification Stream API Endpoint" sub="Read-only, transparent pipeline access">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
        <span className="rounded-md bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
          GET
        </span>
        <span className="flex-1 truncate font-mono text-xs">/api/v1/audit/verification-stream</span>
        <CopyButton text="GET /api/v1/audit/verification-stream" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Links Pashu Aadhaar RFID identifiers to their MAHISHCHIP genomic certificates, PostGIS coordinates, and
        milk delivery logs — for auditors such as Regen Network, Ivy Protocol, or external verifiers.
      </p>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pashu Aadhaar RFID</TableHead>
              <TableHead>MAHISHCHIP Genomic Cert</TableHead>
              <TableHead>PostGIS Coordinates</TableHead>
              <TableHead>Last Milk Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VERIFICATION_STREAM.map((r) => (
              <TableRow key={r.rfid}>
                <TableCell className="font-mono text-xs">{r.rfid}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.genomicCert}</TableCell>
                <TableCell className="text-xs">{r.coords}</TableCell>
                <TableCell className="text-xs">{r.lastDelivery}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
