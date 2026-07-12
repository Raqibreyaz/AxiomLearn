import { Link } from "react-router-dom";
import { BookOpen, PlusCircle, Mail, Shield } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

const roleBadgeColor: Record<string, string> = {
  owner: "#f59e0b",
  admin: "#ef4444",
  instructor: "#7c3aed",
  student: "#10b981",
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const isInstructor = user?.role === "instructor" || user?.role === "admin" || user?.role === "owner";

  const { data: courses, isLoading } = useCourses();

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
            Dashboard
          </p>
          <h1 className="text-4xl font-black mb-2" style={{ color: "var(--color-text)" }}>
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-base" style={{ color: "var(--color-text-muted)" }}>
            Here's what's happening on your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          {/* Profile Card */}
          <div className="lg:col-span-1 glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black mb-4"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), #5b21b6)",
                  color: "white",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>
                {user.name}
              </h2>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full capitalize mb-4"
                style={{
                  background: `${roleBadgeColor[user.role]}20`,
                  color: roleBadgeColor[user.role],
                  border: `1px solid ${roleBadgeColor[user.role]}40`,
                }}
              >
                {user.role}
              </span>
              <div className="w-full space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  <Shield className="w-4 h-4 shrink-0" />
                  <span className="capitalize">{user.role} access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats / Actions */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat: Courses Available */}
            <div
              className="glass rounded-2xl p-6 animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--color-primary-light)" }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                </div>
              </div>
              <p className="text-3xl font-black mb-1" style={{ color: "var(--color-text)" }}>
                {isLoading ? "—" : courses?.length ?? 0}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Courses Available
              </p>
            </div>

            {/* Quick Action */}
            {isInstructor ? (
              <Link
                to="/instructor/create-course"
                id="dashboard-create-course-link"
                className="glass rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200"
                  style={{ background: "var(--color-primary-light)" }}
                >
                  <PlusCircle className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>
                    Create a Course
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Share your expertise with learners worldwide.
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                to="/courses"
                id="dashboard-browse-link"
                className="glass rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--color-primary-light)" }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>
                    Browse Courses
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Discover new skills and expand your knowledge.
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Latest Courses */}
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              Latest Courses
            </h2>
            <Link
              to="/courses"
              id="dashboard-view-all-link"
              className="text-sm font-medium transition-opacity duration-200 hover:opacity-70"
              style={{ color: "var(--color-accent)" }}
            >
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
              {courses.slice(0, 8).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: "var(--color-accent)" }} />
              <p className="font-medium" style={{ color: "var(--color-text-muted)" }}>
                No courses available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
