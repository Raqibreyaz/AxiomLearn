import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Image, Type, AlignLeft, Globe, Award, DollarSign, Layers } from "lucide-react";
import { useCreateCourse } from "../hooks/useCourses";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    domain: "code",
    thumbnail: "",
    language: "en" as "en" | "hi" | "hinglish",
    learningMode: "recorded" as "live" | "recorded" | "hybrid",
    level: "beginner" as "beginner" | "intermediate" | "advanced" | "all-levels",
    tagsInput: "",
    status: "draft" as "draft" | "published" | "archived",
    price: 0,
  });
  const [error, setError] = useState("");

  const createMutation = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim() || !form.shortDescription.trim() || !form.domain.trim()) {
      setError("Title, description, short description, and domain are required.");
      return;
    }
    if (form.shortDescription.length > 180) {
      setError("Short description must be 180 characters or less.");
      return;
    }
    const tags = form.tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    createMutation.mutate(
      {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        domain: form.domain,
        thumbnail: form.thumbnail || undefined,
        language: form.language,
        learningMode: form.learningMode,
        level: form.level,
        tags,
        status: form.status,
        price: Number(form.price),
      },
      {
        onSuccess: (course) => navigate(`/courses/${course._id}`),
        onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to create course."),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-canvas">
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

            {/* Short Description */}
            <div>
              <label htmlFor="create-short-description" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <AlignLeft className="w-4 h-4" />
                Short Description <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <textarea
                id="create-short-description"
                required
                rows={2}
                maxLength={180}
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="A brief summary (max 180 chars) for search results..."
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200 resize-none"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  lineHeight: "1.5",
                }}
              />
              <p className="text-xs mt-1.5 flex justify-between" style={{ color: "var(--color-text-dim)" }}>
                <span>Brief overview shown on course listings</span>
                <span>{form.shortDescription.length} / 180 characters</span>
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="create-description" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                <AlignLeft className="w-4 h-4" />
                Full Description <span style={{ color: "var(--color-error)" }}>*</span>
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

            {/* Domain & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="create-domain" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <Layers className="w-4 h-4" />
                  Domain <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <select
                  id="create-domain"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="code">Code</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="data">Data</option>
                  <option value="language">Language</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label htmlFor="create-price" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <DollarSign className="w-4 h-4" />
                  Price (INR)
                </label>
                <input
                  id="create-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            </div>

            {/* Level, Language & Learning Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="create-level" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <Award className="w-4 h-4" />
                  Level
                </label>
                <select
                  id="create-level"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value as "beginner" | "intermediate" | "advanced" | "all-levels" })}
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All Levels</option>
                </select>
              </div>

              <div>
                <label htmlFor="create-language" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <Globe className="w-4 h-4" />
                  Language
                </label>
                <select
                  id="create-language"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value as "en" | "hi" | "hinglish" })}
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>

              <div>
                <label htmlFor="create-mode" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <BookOpen className="w-4 h-4" />
                  Mode
                </label>
                <select
                  id="create-mode"
                  value={form.learningMode}
                  onChange={(e) => setForm({ ...form, learningMode: e.target.value as "live" | "recorded" | "hybrid" })}
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="recorded">Recorded</option>
                  <option value="live">Live</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Tags & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="create-tags" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <Type className="w-4 h-4" />
                  Tags
                </label>
                <input
                  id="create-tags"
                  type="text"
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  placeholder="e.g. react, node, nextjs"
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
                <span className="text-[10px] mt-1 block" style={{ color: "var(--color-text-dim)" }}>
                  Separate tags with commas
                </span>
              </div>

              <div>
                <label htmlFor="create-status" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                  <Layers className="w-4 h-4" />
                  Status
                </label>
                <select
                  id="create-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })}
                  className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
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
