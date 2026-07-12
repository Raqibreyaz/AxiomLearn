import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Save, Image, Type, AlignLeft } from "lucide-react";
import { useCourse, useUpdateCourse } from "../hooks/useCourses";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: course, isLoading } = useCourse(id!);
  const updateMutation = useUpdateCourse(id!);

  const [form, setForm] = useState({ title: "", description: "", thumbnail: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail ?? "",
      });
    }
  }, [course]);

  const canEdit =
    user &&
    course &&
    (user._id === (course.instructor as any)?._id ||
      user.role === "admin" ||
      user.role === "owner");

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text)" }}>Course Not Found</h2>
          <Link to="/courses" className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}>
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-error)" }}>Access Denied</h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>You don't have permission to edit this course.</p>
          <Link to="/dashboard" className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    updateMutation.mutate(
      { ...form, thumbnail: form.thumbnail || undefined },
      {
        onSuccess: () => {
          setSuccess("Course updated successfully!");
          setTimeout(() => navigate(`/courses/${id}`), 1500);
        },
        onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to update course."),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          to={`/courses/${id}`}
          id="edit-course-back-btn"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors duration-200 hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-primary-light)" }}
            >
              <BookOpen className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
            </div>
            <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>
              Edit Course
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Update the details of <span className="font-semibold" style={{ color: "var(--color-accent)" }}>"{course.title}"</span>
          </p>
        </div>

        {/* Form */}
        <div className="gradient-border p-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-lg text-sm font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}
            {success && (
              <div className="px-4 py-3 rounded-lg text-sm font-medium" style={{ background: "rgba(16,185,129,0.1)", color: "var(--color-success)", border: "1px solid rgba(16,185,129,0.2)" }}>
                {success}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="edit-title" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <Type className="w-4 h-4" /> Course Title <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <AlignLeft className="w-4 h-4" /> Description <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <textarea
                id="edit-description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200 resize-none"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)", lineHeight: "1.6" }}
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label htmlFor="edit-thumbnail" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <Image className="w-4 h-4" /> Thumbnail URL <span className="text-xs font-normal" style={{ color: "var(--color-text-dim)" }}>(optional)</span>
              </label>
              <input
                id="edit-thumbnail"
                type="url"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
              />
              {form.thumbnail && (
                <div className="mt-3 rounded-xl overflow-hidden h-32" style={{ background: "var(--color-surface-2)" }}>
                  <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="edit-course-submit-btn"
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
            >
              {updateMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
