/* Spec §16 — Footer
   bg ink, four-column grid (1.4fr 1fr 1fr 1fr), collapses to 1 col below 768px */

import { Link } from "react-router-dom";

const LogoMark = () => (
  <div className="w-7 h-7 rounded-sm bg-axiom flex items-center justify-center shrink-0">
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path d="M12 3L20 19H4L12 3Z" stroke="#F0EEE6" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
);

const Footer = () => (
  <footer className="bg-ink text-ti2 pt-[52px]">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 pb-8">

        {/* Brand column */}
        <div>
          <div className="flex items-center gap-[9px] mb-3">
            <LogoMark />
            <span className="font-body font-semibold text-[17px] text-ti1">AxiomLearn</span>
          </div>
          <p className="text-[13px] text-ti2 max-w-[260px] leading-relaxed">
            A subject-agnostic learning platform — built on discover, practice, prove.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-mono text-[12px] text-ti3 uppercase tracking-[0.03em] mb-[14px]">Product</h4>
          <ul className="space-y-[9px]">
            {["Courses", "Pricing", "Roadmap"].map(item => (
              <li key={item}><Link to="/courses" className="text-[13.5px] text-ti2 hover:text-ti1 transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-mono text-[12px] text-ti3 uppercase tracking-[0.03em] mb-[14px]">Company</h4>
          <ul className="space-y-[9px]">
            {["About", "Careers", "Contact"].map(item => (
              <li key={item}><span className="text-[13.5px] text-ti2">{item}</span></li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-mono text-[12px] text-ti3 uppercase tracking-[0.03em] mb-[14px]">Legal</h4>
          <ul className="space-y-[9px]">
            {["Terms", "Privacy", "Refunds"].map(item => (
              <li key={item}><span className="text-[13.5px] text-ti2">{item}</span></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="font-mono text-[11.5px] text-ti3 border-t border-line-ink py-5 flex justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} AxiomLearn — open source project.</span>
        <span>built in Lucknow, IN</span>
      </div>
    </div>
  </footer>
);

export default Footer;
