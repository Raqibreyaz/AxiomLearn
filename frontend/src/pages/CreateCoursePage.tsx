import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Image, Type, AlignLeft } from "lucide-react";
import { useCreateCourse } from "../hooks/useCourses";
import type { CreateCoursePayload } from "../api/courses.api";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateCoursePayload>({
    title: "",
    description: "",
    thumbnail: "",
  });
  const [error, setError] = useState("");

  const createMutation = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    createMutation.mutate(
      { ...form, thumbnail: form.thumbnail || undefined },
      {
        onSuccess: (course) => navigate(`/courses/${course._id}`),
        onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to create course."),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          to="/dashboard"
          id="create-course-back-btn"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-colors duration-200 hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
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
              Create Course
            </h1>
          </div>
          <p className="text-sm ml-13" style={{ color: "var(--color-text-muted)" }}>
            Share your expertise with thousands of learners.
          </p>
        </div>

        {/* Form */}
        <div className="gradient-border p-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="create-title" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <Type className="w-4 h-4" />
                Course Title <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <input
                id="create-title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Complete React Developer Bootcamp"
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="create-description" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <AlignLeft className="w-4 h-4" />
                Description <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <textarea
                id="create-description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what students will learn in this course..."
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200 resize-none"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  lineHeight: "1.6",
                }}
              />
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-dim)" }}>
                {form.description.length} characters
              </p>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label htmlFor="create-thumbnail" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <Image className="w-4 h-4" />
                Thumbnail URL <span className="text-xs font-normal" style={{ color: "var(--color-text-dim)" }}>(optional)</span>
              </label>
              <input
                id="create-thumbnail"
                type="url"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
              {/* Thumbnail preview */}
              {form.thumbnail && (
                <div className="mt-3 rounded-xl overflow-hidden h-32" style={{ background: "var(--color-surface-2)" }}>
                  <img
                    src={form.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="create-course-submit-btn"
              type="submit"
              disabled={createMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
            >
              {createMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Create Course
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
