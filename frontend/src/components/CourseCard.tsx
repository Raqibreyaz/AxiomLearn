import { Link } from "react-router-dom";
import { BookOpen, User, Clock } from "lucide-react";
import type { Course } from "../api/courses.api";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const formattedDate = new Date(course.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group block animate-fade-in"
      id={`course-card-${course._id}`}
    >
      <div
        className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Thumbnail */}
        <div className="relative h-44 overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 opacity-30">
                <BookOpen className="w-10 h-10" style={{ color: "var(--color-accent)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                  No thumbnail
                </span>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="font-semibold text-base mb-2 line-clamp-2 leading-snug transition-colors duration-200"
            style={{ color: "var(--color-text)" }}
          >
            {course.title}
          </h3>

          <p
            className="text-sm mb-4 line-clamp-2 leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {course.description}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: "var(--color-primary-light)", color: "var(--color-accent)" }}
              >
                {course.instructor?.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                {course.instructor?.name ?? "Instructor"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: "var(--color-text-dim)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
