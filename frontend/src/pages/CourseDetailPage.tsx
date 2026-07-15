/* /courses/:id
   Spec: CourseHero, PlayerCard + BuyBox §8, CurriculumAccordion §9, IncludesBox */

import { useParams, Link, useNavigate } from "react-router-dom";
import { useCourse } from "../hooks/useCourses";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import CurriculumAccordion, {
  type CurriculumSection,
} from "../components/CurriculumAccordion";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

const domainConfig: Record<
  string,
  { thumbClass: string; glyph: string; label: string }
> = {
  CODE: { thumbClass: "thumb-code", glyph: "◈", label: "Code" },
  DESIGN: { thumbClass: "thumb-design", glyph: "◐", label: "Design" },
  BUSINESS: { thumbClass: "thumb-business", glyph: "◆", label: "Business" },
  DATA: { thumbClass: "thumb-data", glyph: "◉", label: "Data" },
  LANGUAGE: { thumbClass: "thumb-language", glyph: "✎", label: "Language" },
  CREATIVE: { thumbClass: "thumb-creative", glyph: "◬", label: "Creative" },
};

const formatLevel = (level?: string) => {
  if (!level) return "Beginner";
  if (level === "all-levels") return "All Levels";
  return level.charAt(0).toUpperCase() + level.slice(1);
};

const formatLanguage = (lang?: string) => {
  if (lang === "hi") return "Hindi";
  if (lang === "hinglish") return "Hinglish";
  return "English";
};

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: course, isLoading, isError } = useCourse(id!);

  const isInstructor =
    user &&
    (user.role === "instructor" ||
      user.role === "admin" ||
      user.role === "owner");
  const canEdit =
    isInstructor &&
    course &&
    (user._id === course.instructor?._id ||
      user.role === "admin" ||
      user.role === "owner");

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-[28px] font-semibold text-ink mb-3">
            Course not found
          </h2>
          <Button variant="primary" onClick={() => navigate("/courses")}>
            Browse courses
          </Button>
        </div>
      </div>
    );
  }

  const domain =
    domainConfig[course.domain?.toUpperCase() ?? ""] ?? domainConfig.CODE;
  const price = course.price ?? 499;
  const originalPrice = course.originalPrice;

  const curriculum: CurriculumSection[] = course.sections
    ? course.sections.map((sec) => ({
        title: sec.title,
        lessons: sec.lectures
          ? sec.lectures.map((lec) => ({
              id: lec._id,
              title: lec.title,
              durationSec: lec.lectureDurationSeconds || 0,
              isFreePreview: lec.isPreview,
              isLocked: !lec.isPreview,
            }))
          : [],
      }))
    : [];

  const totalLessons = curriculum.reduce((a, s) => a + s.lessons.length, 0);
  const totalDurationSec = curriculum.reduce(
    (a, s) => a + s.lessons.reduce((b, l) => b + (l.durationSec ?? 0), 0),
    0,
  );
  const totalHours =
    totalDurationSec > 0
      ? totalDurationSec >= 3600
        ? `${Math.floor(totalDurationSec / 3600)}h ${Math.floor((totalDurationSec % 3600) / 60)}m`
        : `${Math.floor(totalDurationSec / 60)}m`
      : null;

  return (
    <div>
      {/* ────────────────────────────────────────────────────────
          SECTION 1 — HERO
          Dark ink background, full-bleed, with course info on left
          and sticky buy-card on right.
          ──────────────────────────────────────────────────────── */}
      <div className="bg-ink-sunken text-ti1">
        <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav className="font-mono text-[12px] text-ti3 mb-6 flex items-center gap-1">
            <Link to="/" className="hover:text-ti1 transition-colors">
              Home
            </Link>
            <span className="text-ti3/50">/</span>
            <Link to="/courses" className="hover:text-ti1 transition-colors">
              Courses
            </Link>
            <span className="text-ti3/50">/</span>
            <span className="text-ti2 font-medium">{id}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* LEFT — Course Info */}
            <div>
              {/* Domain pill */}
              <span className="inline-block font-mono text-[10.5px] font-medium tracking-wider uppercase px-[10px] py-[4px] rounded-sm bg-white/[0.08] border border-white/[0.1] text-ti2 mb-4">
                {domain.label}
              </span>

              <h1 className="font-display font-semibold text-[32px] lg:text-[38px] leading-[1.12] text-white mb-4">
                {course.title}
              </h1>

              {course.shortDescription && (
                <p className="text-ti2 text-[16px] leading-relaxed mb-6 max-w-[580px]">
                  {course.shortDescription}
                </p>
              )}

              {/* Instructor row */}
              <div className="flex items-center gap-3 mb-6">
                {course.instructor?.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-8 h-8 rounded-full object-cover border border-line-ink"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-axiom to-d-design flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {course.instructor?.name?.charAt(0) ?? "I"}
                  </div>
                )}
                <span className="text-[14px] text-ti2">
                  Created by{" "}
                  <b className="text-white font-medium">
                    {course.instructor?.name ?? "Instructor"}
                  </b>
                </span>
              </div>

              {/* Meta badges */}
              <div className="flex items-center gap-3 flex-wrap">
                {totalLessons > 0 && (
                  <span className="font-mono text-[11px] text-ti3 border border-line-ink px-[10px] py-[5px] rounded-sm">
                    {totalLessons} lessons{totalHours ? ` · ${totalHours}` : ""}
                  </span>
                )}
                <span className="font-mono text-[11px] text-ti3 border border-line-ink px-[10px] py-[5px] rounded-sm">
                  {formatLanguage(course.language)}
                </span>
                <span className="font-mono text-[11px] text-ti3 border border-line-ink px-[10px] py-[5px] rounded-sm">
                  {formatLevel(course.level)}
                </span>
                {course.learningMode && (
                  <span className="font-mono text-[11px] text-ti3 border border-line-ink px-[10px] py-[5px] rounded-sm capitalize">
                    {course.learningMode}
                  </span>
                )}
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-4">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-ti3 bg-white/[0.05] px-[8px] py-[3px] rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Sticky Buy Card */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-paper rounded-lg overflow-hidden shadow-raised border border-line">
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-canvas">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`${domain.thumbClass} absolute inset-0 flex items-center justify-center`}
                    >
                      <span
                        className="text-[36px] select-none"
                        aria-hidden="true"
                      >
                        {domain.glyph}
                      </span>
                    </div>
                  )}
                </div>

                {/* Buy box content */}
                <div className="p-5">
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display font-semibold text-[28px] text-ink">
                      ₹{price.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="font-mono text-[13px] text-t3 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {originalPrice && (
                    <p className="font-mono text-[11px] text-proof font-medium mb-4">
                      {Math.round((1 - price / originalPrice) * 100)}% off
                    </p>
                  )}

                  {/* CTA */}
                  {user ? (
                    <Button variant="proof" size="lg" block id="enroll-btn">
                      Enroll now
                    </Button>
                  ) : (
                    <Button
                      variant="proof"
                      size="lg"
                      block
                      onClick={() => navigate("/signup")}
                      id="enroll-btn"
                    >
                      Sign up to enroll
                    </Button>
                  )}

                  {/* Includes */}
                  <ul className="mt-5 space-y-[10px] border-t border-line pt-5">
                    {[
                      totalLessons > 0
                        ? `${totalLessons} on-demand video lessons`
                        : null,
                      totalHours ? `${totalHours} of content` : null,
                      "Progress tracking & resume playback",
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-[9px] text-[13px] text-t2"
                        >
                          <span className="text-axiom text-[11px]">✓</span>
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
      </div>

      {/* ────────────────────────────────────────────────────────
          SECTION 2 — BODY
          Light background with curriculum, description, info, instructor
          ──────────────────────────────────────────────────────── */}
      <div className="bg-canvas">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 items-start">
            {/* LEFT — Curriculum + Description */}
            <div className="space-y-10">
              {/* Curriculum */}
              <section>
                <h2 className="font-display font-semibold text-[22px] text-ink mb-1">
                  Curriculum
                </h2>
                <p className="font-mono text-[12px] text-t3 mb-5">
                  {curriculum.length} section
                  {curriculum.length !== 1 ? "s" : ""} · {totalLessons} lesson
                  {totalLessons !== 1 ? "s" : ""}
                  {totalHours ? ` · ${totalHours}` : ""}
                </p>
                {curriculum.length > 0 ? (
                  <CurriculumAccordion 
                    sections={curriculum} 
                    onLessonSelect={(lesson) => navigate(`/courses/${course._id}/learn?lesson=${lesson.id}`)}
                  />
                ) : (
                  <div className="border border-dashed border-line rounded-md py-8 text-center">
                    <p className="text-[13.5px] text-t3">
                      Curriculum will be available soon.
                    </p>
                  </div>
                )}
              </section>

              {/* About this course */}
              {course.description && (
                <section>
                  <h2 className="font-display font-semibold text-[22px] text-ink mb-4">
                    About this course
                  </h2>
                  <div className="bg-paper border border-line rounded-md p-6">
                    <p className="text-[14px] text-t2 leading-[1.7] whitespace-pre-wrap">
                      {course.description}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT — Course Info + Instructor */}
            <div className="space-y-8">
              {/* Course Info Card */}
              <section>
                <h2 className="font-display font-semibold text-[20px] text-ink mb-4">
                  Course Info
                </h2>
                <div className="bg-paper border border-line rounded-md divide-y divide-line">
                  {[
                    {
                      label: "Domain",
                      value: course.domain ? domain.label : "Code",
                    },
                    { label: "Level", value: formatLevel(course.level) },
                    {
                      label: "Language",
                      value: formatLanguage(course.language),
                    },
                    {
                      label: "Learning Mode",
                      value: course.learningMode
                        ? course.learningMode.charAt(0).toUpperCase() +
                          course.learningMode.slice(1)
                        : "Recorded",
                    },
                    {
                      label: "Last Updated",
                      value: new Date(course.updatedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" },
                      ),
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center px-5 py-[14px]"
                    >
                      <span className="font-mono text-[11px] text-t3 uppercase tracking-wider">
                        {row.label}
                      </span>
                      <span className="text-[13.5px] font-medium text-ink">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Instructor Card */}
              <section>
                <h2 className="font-display font-semibold text-[20px] text-ink mb-4">
                  Instructor
                </h2>
                <div className="bg-paper border border-line rounded-md p-5">
                  <div className="flex items-center gap-4 mb-4">
                    {course.instructor?.avatar ? (
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-14 h-14 rounded-full object-cover border border-line"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-axiom to-d-design flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {(course.instructor?.name ?? "I")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-body font-semibold text-[16px] text-ink">
                        {course.instructor?.name ?? "Instructor"}
                      </h3>
                      <p className="font-mono text-[11px] text-t3 mt-0.5">
                        Course Creator
                      </p>
                    </div>
                  </div>
                  {course.instructor?.bio && (
                    <p className="text-[13.5px] text-t2 leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
