/* Spec §7 — Section Header
   Eyebrow (mono, uppercase, axiom) + heading (display-md, ink) + optional See All link.
   "Axiom NN" numbering ONLY when section is genuinely a step in discover→practice→prove. */

import { Link } from "react-router-dom";

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  seeAllTo?: string;
}

const SectionHeader = ({ eyebrow, heading, seeAllTo }: SectionHeaderProps) => (
  <div className="flex items-baseline justify-between flex-wrap gap-[10px] mb-7">
    <div>
      <div className="font-mono text-[11.5px] font-medium uppercase tracking-[0.04em] text-axiom mb-[6px]">
        {eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[28px] text-ink leading-tight">
        {heading}
      </h2>
    </div>
    {seeAllTo && (
      <Link
        to={seeAllTo}
        className="font-mono text-[12.5px] text-axiom hover:underline whitespace-nowrap"
      >
        See all →
      </Link>
    )}
  </div>
);

export default SectionHeader;
