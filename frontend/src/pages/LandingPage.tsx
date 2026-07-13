/* Landing page — spec §3 (Hero + AxiomPanel) + §4 + §7 + §5 + §6 grid + Strip + Testimonials + §16 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import AxiomPanel from "../components/AxiomPanel";
import SearchBar from "../components/SearchBar";
import SectionHeader from "../components/SectionHeader";
import CategoryChips, { type Domain } from "../components/CategoryChips";
import CourseCard from "../components/CourseCard";
import Footer from "../components/Footer";

const stats = [
  { value: "18,900+", label: "learners" },
  { value: "6",       label: "subject domains" },
  { value: "4.8/5",   label: "avg. rating" },
];

const stripStats = [
  { value: "18,900+", label: "active learners" },
  { value: "96%",     label: "would recommend" },
  { value: "6",       label: "subject domains" },
  { value: "24/7",    label: "self-paced access" },
];

const testimonials = [
  { quote: "The 'prove it' project at the end of the pricing course was the first time a course actually tested if I understood it.", name: "Meera J.", track: "Business track" },
  { quote: "I've tried three language apps. This is the first one that explains grammar before drilling it.", name: "Owen T.", track: "Language track" },
  { quote: "Resume-where-I-left-off actually works across my phone and laptop. Small thing, huge relief.", name: "Priya N.", track: "Design track" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeDomain, setActiveDomain] = useState<Domain>("All");


  const { data: courses = [], isLoading } = useCourses();

  const filteredCourses = courses
    .filter((c) => {
      if (activeDomain !== "All") {
        const d = (c as any).domain?.toUpperCase();
        if (d !== activeDomain.toUpperCase()) return false;
      }
      return true;
    })
    .slice(0, 6); /* Show max 6 on landing */

  return (
    <div>
      {/* ── HERO ── §3 */}
      <section className="py-[80px] pb-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-14 items-center">

            {/* Left column */}
            <div>
              {/* Eyebrow — no // prefix per spec */}
              <div className="font-mono text-[11.5px] font-medium uppercase tracking-[0.04em] text-axiom mb-[6px]">
                start from first principles
              </div>

              {/* Headline — max 2 lines, one accent phrase */}
              <h1 className="font-display font-semibold text-[56px] leading-[1.05] tracking-[-0.01em] text-ink mb-[18px]">
                Every subject has<br />
                its <span className="text-axiom">axioms.</span> Learn them.
              </h1>

              {/* Lead — ≤26 words */}
              <p className="text-[17px] leading-relaxed text-t2 max-w-[480px] mb-7">
                Design, business, data, language, code, and craft — taught as a sequence of foundational ideas you can actually prove you understand.
              </p>

              {/* CTA row */}
              <div className="flex gap-3 flex-wrap mb-9">
                <Button variant="primary" size="lg" onClick={() => navigate("/courses")} id="hero-browse-btn">
                  Browse courses →
                </Button>
                {!user && (
                  <Button variant="ghost" size="lg" onClick={() => navigate("/signup")} id="hero-signup-btn">
                    Create free account
                  </Button>
                )}
              </div>

              {/* Stat row — 3 items per spec */}
              <div className="flex gap-8 flex-wrap">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <b className="font-display font-semibold text-[28px] leading-tight text-ink block">{value}</b>
                    <span className="font-mono text-[11px] text-t3 uppercase tracking-[0.03em]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — AxiomPanel */}
            <AxiomPanel />
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── §4 */}
      <section className="max-w-[1200px] mx-auto px-6 pb-0">
        <SearchBar onSearch={(q) => { navigate(`/courses?search=${q}`); }} />
      </section>

      {/* ── COURSE GRID ── */}
      <section className="py-[72px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            eyebrow="featured this week"
            heading="Start where you are"
            seeAllTo="/courses"
          />

          {/* Category chips §5 */}
          <div className="mb-8">
            <CategoryChips active={activeDomain} onChange={setActiveDomain} />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-paper border border-line rounded-md h-[260px] animate-pulse" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-t2">No courses yet in this domain.</div>
          )}
        </div>
      </section>

      {/* ── STRIP ── dark ink banner with 4 stats */}
      <div className="bg-ink py-11">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {stripStats.map(({ value, label }) => (
              <div key={label}>
                <b className="font-display font-semibold text-[32px] text-axiom block">{value}</b>
                <span className="font-mono text-[11.5px] text-ti2 uppercase tracking-[0.03em]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="py-[72px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader eyebrow="from the community" heading="What learners say" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map(({ quote, name, track }) => (
              <div key={name} className="bg-paper border border-line rounded-md p-[22px]">
                <p className="text-t2 text-[14.5px] mb-[18px] leading-relaxed">"{quote}"</p>
                <div className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-pill bg-gradient-to-br from-axiom to-d-design shrink-0" />
                  <div>
                    <b className="text-[13.5px] font-semibold text-ink block">{name}</b>
                    <span className="font-mono text-[11px] text-t3">{track}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
