/* Spec §11 — KPI Stat Card
   Grid of 4 across desktop, 2 tablet, 1 mobile. */

type DeltaDir = "up" | "down" | "flat";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: DeltaDir;
}

const deltaClasses: Record<DeltaDir, string> = {
  up:   "text-success",
  down: "text-danger",
  flat: "text-t3",
};

const KpiCard = ({ label, value, delta, deltaDir = "flat" }: KpiCardProps) => (
  <div className="bg-paper border border-line rounded-md px-[18px] py-4">
    <div className="font-mono text-[11px] text-t3 uppercase tracking-[0.03em] mb-2">{label}</div>
    <div className="font-display text-[24px] font-semibold text-ink leading-tight">{value}</div>
    {delta && (
      <div className={`font-mono text-[11px] mt-[7px] ${deltaClasses[deltaDir]}`}>
        {delta}
      </div>
    )}
  </div>
);

export default KpiCard;
