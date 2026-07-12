import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Edit, User } from "lucide-react";
import { useCourse } from "../hooks/useCourses";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: course, isLoading, isError } = useCourse(id!);

  const canEdit =
    user &&
    course &&
    (user._id === (course.instructor as any)?._id ||
      user.role === "admin" ||
      user.role === "owner");

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError || !course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
            Course Not Found
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
            The course you're looking for doesn't exist.
          </p>
          <Link
            to="/courses"
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link
          to="/courses"
          id="course-detail-back-btn"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors duration-200 hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Thumbnail */}
            <div
              className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8"
              style={{ background: "var(--color-surface-2)" }}
            >
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 opacity-20" style={{ color: "var(--color-accent)" }} />
                </div>
              )}
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text)" }}>
              {course.title}
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-text-muted)" }}>
              {course.description}
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Course Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-5" style={{ color: "var(--color-text)" }}>
                Course Info
              </h3>

              <div className="space-y-4">
                {/* Instructor */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-primary-light)" }}
                  >
                    <User className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text-dim)" }}>
                      Instructor
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {course.instructor?.name ?? "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-primary-light)" }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text-dim)" }}>
                      Created
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {new Date(course.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {canEdit && (
                <Link
                  to={`/instructor/courses/${course._id}/edit`}
                  id="course-detail-edit-btn"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
                >
                  <Edit className="w-4 h-4" />
                  Edit Course
                </Link>
              )}

              {!user && (
                <Link
                  to="/signup"
                  id="course-detail-enroll-btn"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 glow-sm"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
                >
                  Enroll Now — Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
