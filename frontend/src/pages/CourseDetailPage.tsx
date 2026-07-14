/* /courses/[slug] or /courses/:id
   Spec: CourseHero, PlayerCard + BuyBox §8, CurriculumAccordion §9, IncludesBox */

import { useParams, Link, useNavigate } from "react-router-dom";
import { useCourse } from "../hooks/useCourses";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import CurriculumAccordion, { type CurriculumSection } from "../components/CurriculumAccordion";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

/* Mock curriculum for courses without lesson data from backend */
const getMockCurriculum = (title: string): CurriculumSection[] => [
  {
    title: "Axiom 01 · Discover — the core idea",
    lessons: [
      { id: "l1", title: `Why this matters in ${title.split(" ")[0].toLowerCase()}`, durationSec: 372, isFreePreview: true },
      { id: "l2", title: "The foundational concept, clearly explained", durationSec: 460, isFreePreview: true },
      { id: "l3", title: "Common misconceptions and how to avoid them", durationSec: 545, isLocked: true },
    ],
  },
  {
    title: "Axiom 02 · Practice — guided application",
    lessons: [
      { id: "l4", title: "Working through a real-world example", durationSec: 422, isFreePreview: true },
      { id: "l5", title: "Building on feedback", durationSec: 870, isLocked: true },
      { id: "l6", title: "Common patterns you'll use repeatedly", durationSec: 654, isLocked: true },
    ],
  },
  {
    title: "Axiom 03 · Prove it — your own project",
    lessons: [
      { id: "l7", title: "Project brief and deliverables", durationSec: 300, isLocked: true },
      { id: "l8", title: "Building end-to-end", durationSec: 1124, isLocked: true },
      { id: "l9", title: "Review and iteration", durationSec: 686, isLocked: true },
    ],
  },
];

const domainConfig: Record<string, { thumbClass: string; glyph: string }> = {
  CODE:     { thumbClass: "thumb-code",     glyph: "◈" },
  DESIGN:   { thumbClass: "thumb-design",   glyph: "◐" },
  BUSINESS: { thumbClass: "thumb-business", glyph: "◆" },
  DATA:     { thumbClass: "thumb-data",     glyph: "◉" },
  LANGUAGE: { thumbClass: "thumb-language", glyph: "✎" },
  CREATIVE: { thumbClass: "thumb-creative", glyph: "◬" },
};

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: course, isLoading, isError } = useCourse(id!);

  const isInstructor = user && (user.role === "instructor" || user.role === "admin" || user.role === "owner");
  const canEdit = isInstructor && course && (user._id === course.instructor?._id || user.role === "admin" || user.role === "owner");

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-[28px] font-semibold text-ink mb-3">Course not found</h2>
          <Button variant="primary" onClick={() => navigate("/courses")}>Browse courses</Button>
        </div>
      </div>
    );
  }

  const domain = domainConfig[course.domain?.toUpperCase() ?? ""] ?? domainConfig.CODE;
  const price = course.price ?? 499;
  const originalPrice = course.originalPrice;
  const curriculum = getMockCurriculum(course.title);

  return (
    <div>
      {/* ── Course Hero ── bg paper, border-bottom */}
      <div className="bg-paper border-b border-line py-11">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-11 items-start">

            {/* Left: course info */}
            <div>
              {/* Breadcrumb */}
              <div className="font-mono text-[12px] text-t3 mb-[18px]">
                ~/courses/<b className="text-axiom font-medium">{course.slug ?? id}</b>
              </div>

              <h1 className="font-display font-semibold text-[34px] leading-[1.15] text-ink mb-[14px]">
                {course.title}
              </h1>

              <p className="text-t2 text-[15px] leading-relaxed mb-5 max-w-[560px]">
                {course.description}
              </p>

              {/* Instructor row */}
              <div className="flex items-center gap-[10px] mb-5">
                <div className="w-[30px] h-[30px] rounded-pill bg-gradient-to-br from-axiom to-d-design flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {course.instructor?.name?.charAt(0) ?? "I"}
                </div>
                <span className="text-[13.5px] text-t2">
                  Created by <b className="text-ink">{course.instructor?.name ?? "Instructor"}</b>
                </span>
              </div>

              {/* Badge row */}
              <div className="flex gap-[10px] flex-wrap">
                {[
                  "★ 4.8 (—)",
                  `${curriculum.reduce((a, s) => a + s.lessons.length, 0)} lessons total`,
                  course.language === "en" ? "English" : course.language === "hi" ? "Hindi" : "Hinglish",
                  course.level === "all-levels" ? "All Levels" : (course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : "Beginner"),
                ].map((badge) => (
                  <span key={badge} className="font-mono text-[11.5px] text-t2 border border-line px-[10px] py-[5px] rounded-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Player card + Buy Box §8 */}
            <div className="bg-paper border border-line rounded-lg overflow-hidden shadow-card">
              {/* Player */}
              <div className="aspect-video flex items-center justify-center relative overflow-hidden bg-paper border-b border-line">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <div className={`${domain.thumbClass} absolute inset-0`} />
                )}
                <span className="absolute top-3 left-3 font-mono text-[11px] bg-black/50 text-white px-[9px] py-1 rounded-sm z-10">
                  ▶ Trailer · 1:32
                </span>
                <div className="w-14 h-14 rounded-pill bg-axiom flex items-center justify-center text-white text-[18px] z-10 cursor-pointer hover:scale-105 transition-transform duration-[180ms] shadow-raised">
                  ▶
                </div>
              </div>

              {/* Buy box */}
              <div className="p-[22px]">
                {/* Price row */}
                <div className="flex items-baseline gap-[10px] mb-1">
                  <span className="font-display font-semibold text-[30px] text-ink">₹{price.toLocaleString()}</span>
                  {originalPrice && (
                    <span className="font-mono text-[14px] text-t3 line-through">₹{originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Urgency — only rendered with real condition */}
                {originalPrice && (
                  <div className="font-mono text-[11.5px] text-proof mb-[18px]">
                    {Math.round((1 - price / originalPrice) * 100)}% off
                  </div>
                )}

                {/* CTAs */}
                {user ? (
                  <Button variant="proof" size="lg" block className="mb-2" id="enroll-btn">
                    Enroll now
                  </Button>
                ) : (
                  <Button variant="proof" size="lg" block className="mb-2" onClick={() => navigate("/signup")} id="enroll-btn">
                    Sign up to enroll
                  </Button>
                )}
                <Button variant="ghost" size="lg" block id="wishlist-btn">
                  Add to wishlist
                </Button>

                {/* Includes checklist */}
                <ul className="mt-[18px] space-y-[10px]">
                  {[
                    `${curriculum.reduce((a, s) => a + s.lessons.length, 0)} on-demand video lessons`,
                    "Progress tracking & resume playback",
                    "Certificate of completion",
                    "Full lifetime access",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-[9px] text-[13.5px] text-t2">
                      <span className="text-axiom">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {canEdit && (
                  <Link
                    to={`/instructor/courses/${course._id}/edit`}
                    className="mt-4 block text-center font-mono text-[12px] text-axiom hover:underline"
                  >
                    Edit this course →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Curriculum + What you'll build ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-11 items-start">
          {/* Curriculum §9 */}
          <div>
            <h2 className="font-display font-semibold text-[22px] text-ink mb-[6px]">Curriculum</h2>
            <p className="font-mono text-[12px] text-t3 mb-[18px]">
              {curriculum.length} sections · {curriculum.reduce((a, s) => a + s.lessons.length, 0)} lessons
            </p>
            <CurriculumAccordion sections={curriculum} />
          </div>

          {/* Instructor Card & Course Details */}
          <div className="space-y-8">
            {/* Course Stats / Details */}
            <div>
              <h2 className="font-display font-semibold text-[22px] text-ink mb-4">Course Info</h2>
              <div className="bg-paper border border-line rounded-md p-[22px] space-y-4">
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="font-mono text-t3 uppercase tracking-wider text-[11px]">Domain</span>
                  <span className="font-medium text-ink capitalize">{course.domain?.toLowerCase() ?? "Code"}</span>
                </div>
                <div className="border-t border-line" />
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="font-mono text-t3 uppercase tracking-wider text-[11px]">Last Updated</span>
                  <span className="font-medium text-ink">
                    {new Date(course.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="border-t border-line" />
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="font-mono text-t3 uppercase tracking-wider text-[11px]">Language</span>
                  <span className="font-medium text-ink capitalize">{course.language}</span>
                </div>
                <div className="border-t border-line" />
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="font-mono text-t3 uppercase tracking-wider text-[11px]">Learning Mode</span>
                  <span className="font-medium text-ink capitalize">{course.learningMode}</span>
                </div>
              </div>
            </div>

            {/* Instructor Box */}
            <div>
              <h2 className="font-display font-semibold text-[22px] text-ink mb-4">Instructor</h2>
              <div className="bg-paper border border-line rounded-md p-[22px]">
                <div className="flex items-center gap-4 mb-4">
                  {course.instructor?.avatar ? (
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-14 h-14 rounded-full object-cover border border-line"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-axiom to-d-design flex items-center justify-center text-white text-xl font-bold">
                      {(course.instructor?.name ?? "I").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-body font-semibold text-[16px] text-ink">
                      {course.instructor?.name ?? "Instructor"}
                    </h3>
                    <p className="font-mono text-[11px] text-t3 mt-0.5">Course Creator</p>
                  </div>
                </div>
                <p className="text-[13.5px] text-t2 leading-relaxed">
                  {course.instructor?.bio ?? "Expert instructor dedicated to providing high-quality, practical learning resources. Learn step-by-step with structured lessons and assignments."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
