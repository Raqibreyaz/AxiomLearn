/* Spec §5 — Category Chip / Filter Pill
   Domains only: All · Code · Design · Business · Data · Language · Creative */

const DOMAINS = ["All", "Code", "Design", "Business", "Data", "Language", "Creative"] as const;
export type Domain = (typeof DOMAINS)[number];

interface CategoryChipsProps {
  active: Domain;
  onChange: (domain: Domain) => void;
}

const CategoryChips = ({ active, onChange }: CategoryChipsProps) => (
  <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by domain">
    {DOMAINS.map((domain) => (
      <button
        key={domain}
        onClick={() => onChange(domain)}
        className={`
          font-mono text-[12.5px] px-[14px] py-[7px] rounded-pill border transition-colors duration-[120ms]
          ${active === domain
            ? "bg-axiom-tint border-axiom text-axiom"
            : "bg-paper border-line text-t2 hover:border-t3 hover:text-ink"}
        `}
        aria-pressed={active === domain}
        id={`chip-${domain.toLowerCase()}`}
      >
        {domain}
      </button>
    ))}
  </div>
);

export default CategoryChips;
export { DOMAINS };
