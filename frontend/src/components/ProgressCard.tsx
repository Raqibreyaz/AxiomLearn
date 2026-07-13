/* Spec §12 — Progress Card ("Continue learning")
   Horizontal card: thumbnail 70×52px, info column with progress bar, trailing CTA */

import Button from "./Button";

interface ProgressCardProps {
  title: string;
  domain: string; /* e.g. "design" */
  glyph: string;
  currentLesson: number;
  totalLessons: number;
  resumeAt?: string; /* e.g. "09:22" */
  progress: number; /* 0–100 */
  completed?: boolean;
  onResume?: () => void;
  onViewCertificate?: () => void;
}

const domainThumbClass: Record<string, string> = {
  code:     "thumb-code",
  design:   "thumb-design",
  business: "thumb-business",
  data:     "thumb-data",
  language: "thumb-language",
  creative: "thumb-creative",
};

const ProgressCard = ({
  title, domain, glyph, currentLesson, totalLessons,
  resumeAt, progress, completed, onResume, onViewCertificate,
}: ProgressCardProps) => {
  const thumbClass = domainThumbClass[domain.toLowerCase()] ?? "thumb-code";

  return (
    <div className="bg-paper border border-line rounded-md p-4 flex gap-[14px] items-center mb-3">
      {/* Thumbnail 70×52 */}
      <div className={`${thumbClass} w-[70px] h-[52px] rounded-sm flex items-center justify-center text-[16px] shrink-0`}>
        {glyph}
      </div>

      {/* Info column */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-semibold text-ink mb-[5px] truncate">{title}</h4>
        <div className="font-mono text-[11px] text-t3 mb-[9px]">
          {completed
            ? "Completed · certificate issued"
            : `Lesson ${currentLesson} of ${totalLessons}${resumeAt ? ` · resume at ${resumeAt}` : ""}`}
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill${completed ? " complete" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      {completed ? (
        <Button variant="ghost" size="sm" onClick={onViewCertificate} className="shrink-0">
          View certificate
        </Button>
      ) : (
        <Button variant="primary" size="sm" onClick={onResume} className="shrink-0">
          Resume
        </Button>
      )}
    </div>
  );
};

export default ProgressCard;
