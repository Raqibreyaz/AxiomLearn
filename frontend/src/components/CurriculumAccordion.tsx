/* Spec §9 — Curriculum Accordion / Lesson Row
   Uses native <details>/<summary> for accessible accordion behavior.
   Axiom 01/02/03 numbering ONLY when section genuinely follows discover→practice→prove arc. */

export interface Lesson {
  id: string;
  title: string;
  durationSec?: number;
  isFreePreview?: boolean;
  isLocked?: boolean;
}

export interface CurriculumSection {
  title: string;
  lessons: Lesson[];
}

interface CurriculumAccordionProps {
  sections: CurriculumSection[];
  defaultOpenIndex?: number;
  onLessonSelect?: (lesson: Lesson) => void;
  activeLessonId?: string;
}

const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const totalSectionTime = (lessons: Lesson[]) => {
  const total = lessons.reduce((acc, l) => acc + (l.durationSec ?? 0), 0);
  if (!total) return "";
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const CurriculumAccordion = ({ 
  sections, 
  defaultOpenIndex = 0,
  onLessonSelect,
  activeLessonId
}: CurriculumAccordionProps) => (
  <div>
    {sections.map((section, i) => (
      <details
        key={i}
        className="border border-line rounded-md mb-3 overflow-hidden bg-paper"
        open={i === defaultOpenIndex || Boolean(activeLessonId && section.lessons.some(l => l.id === activeLessonId))}
      >
        {/* Section header — spec §9: summary with title + N lessons · Xm + chevron */}
        <summary className="list-none px-4 py-[14px] cursor-pointer flex justify-between items-center text-[14px] font-medium text-ink hover:bg-paper-sunken transition-colors">
          <span>{section.title}</span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-[11.5px] text-t3 font-normal">
              {section.lessons.length} lessons
              {totalSectionTime(section.lessons) ? ` · ${totalSectionTime(section.lessons)}` : ""}
            </span>
            <span className="chevron-icon font-mono text-t3 text-[14px]">›</span>
          </span>
        </summary>

        {/* Lesson rows */}
        {section.lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          const isClickable = onLessonSelect && !lesson.isLocked;
          
          return (
            <div
              key={lesson.id}
              onClick={() => isClickable && onLessonSelect(lesson)}
              className={`flex items-center gap-3 px-4 py-[11px] border-t border-line text-[13.5px] ${
                isActive ? "bg-axiom-tint text-axiom" : "text-t2"
              } ${isClickable ? "cursor-pointer hover:bg-paper-sunken transition-colors" : ""}`}
            >
              {/* Status icon */}
              <span
                className="w-4 text-center shrink-0 text-[14px]"
                style={{ color: lesson.isLocked ? "var(--color-t3)" : isActive ? "var(--color-axiom)" : "var(--color-t2)" }}
                aria-label={lesson.isLocked ? "Locked" : "Available"}
              >
                {lesson.isLocked ? "🔒" : isActive ? "❙❙" : "▶"}
              </span>

              {/* Lesson name */}
              <span className={`flex-1 ${isActive ? "font-medium" : ""}`}>{lesson.title}</span>

              {/* Free preview pill */}
              {lesson.isFreePreview && (
                <span className="font-mono text-[10.5px] text-axiom border border-axiom px-[7px] py-[2px] rounded-sm whitespace-nowrap">
                  Preview
                </span>
              )}

              {/* Duration */}
              {lesson.durationSec !== undefined && (
                <span className={`font-mono text-[11.5px] w-11 text-right shrink-0 ${isActive ? "text-axiom" : "text-t3"}`}>
                  {formatDuration(lesson.durationSec)}
                </span>
              )}
            </div>
          );
        })}
      </details>
    ))}
  </div>
);

export default CurriculumAccordion;
