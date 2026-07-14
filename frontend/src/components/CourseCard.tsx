/* Spec §6 — Course Card
   Thumbnail (150px, domain-color gradient, domain tag + centered glyph) →
   title → meta row (rating + reviews) → footer (price + lesson count).
   Domain tag: NOT a file extension. Icon: domain-generic, never a language logo. */

import { Link } from "react-router-dom";
import type { Course } from "../api/courses.api";

/* Domain config — glyph is a generic unicode symbol, never a tech logo */
const domainConfig: Record<string, { thumbClass: string; glyph: string; label: string }> = {
  CODE:     { thumbClass: "thumb-code",     glyph: "◈", label: "Code"     },
  DESIGN:   { thumbClass: "thumb-design",   glyph: "◐", label: "Design"   },
  BUSINESS: { thumbClass: "thumb-business", glyph: "◆", label: "Business" },
  DATA:     { thumbClass: "thumb-data",     glyph: "◉", label: "Data"     },
  LANGUAGE: { thumbClass: "thumb-language", glyph: "✎", label: "Language" },
  CREATIVE: { thumbClass: "thumb-creative", glyph: "◬", label: "Creative" },
};

/* Fallback for courses without domain (e.g. from old MongoDB backend) */
const fallbackDomain = { thumbClass: "thumb-code", glyph: "◈", label: "Course" };

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const domain = domainConfig[(course as any).domain?.toUpperCase?.()] ?? fallbackDomain;

  /* Format price: backend stores in rupees as number or string */
  const price = (course as any).price ?? 499;
  const originalPrice = (course as any).originalPrice;

  /* Lesson count meta */
  const lessonCount = (course as any).lessonCount ?? (course as any).lessons?.length ?? 0;
  const hours = (course as any).totalHours ?? (lessonCount ? `${Math.ceil(lessonCount * 0.2)}h` : "");

  return (
    <Link
      to={`/courses/${(course as any).slug ?? course._id}`}
      className="block group"
      id={`course-card-${course._id}`}
    >
      <div className="bg-paper border border-line rounded-md overflow-hidden cursor-pointer transition-all duration-[180ms] hover:-translate-y-1 hover:border-t3 shadow-card">

        {/* Thumbnail — 150px */}
        <div className="h-[150px] relative flex items-center justify-center overflow-hidden">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className={`${domain.thumbClass} absolute inset-0 flex items-center justify-center`}>
              <span className="text-[30px] select-none" aria-hidden="true">{domain.glyph}</span>
            </div>
          )}
          <span className="absolute top-[10px] left-[10px] font-mono text-[10.5px] font-medium px-[9px] py-1 rounded-sm text-white bg-black/[0.32]">
            {domain.label}
          </span>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-body font-semibold text-[16px] text-ink mb-[7px] whitespace-nowrap overflow-hidden text-ellipsis">
            {course.title}
          </h3>

          {/* Meta row — rating placeholder (backend has no rating field yet) */}
          <div className="flex items-center gap-[7px] text-[13px] text-t2 mb-[13px]">
            <span className="text-gold">★★★★★</span>
            <span>4.8 (—)</span>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="font-mono font-semibold text-[13px] text-ink">
              {originalPrice && (
                <span className="text-t3 line-through font-normal mr-[6px]">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              ₹{price.toLocaleString()}
            </div>
            {lessonCount > 0 && (
              <div className="font-mono text-[11px] text-t3">
                {lessonCount} lessons{hours ? ` · ${hours}` : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
