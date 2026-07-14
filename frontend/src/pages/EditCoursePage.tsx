import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  useCourse, 
  useUpdateCourse, 
  useUpdateThumbnail, 
  useDeleteCourse,
  useCreateSection,
  useUpdateSection,
  useDeleteSection 
} from "../hooks/useCourses";
import { Edit2, Trash2, Plus, X, Check } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardSidebar from "../components/DashboardSidebar";
import Button from "../components/Button";

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: course, isLoading } = useCourse(id!);
  const updateMutation = useUpdateCourse(id!);
  const thumbnailMutation = useUpdateThumbnail(id!);
  const deleteMutation = useDeleteCourse();
  const createSectionMutation = useCreateSection(id!);
  const updateSectionMutation = useUpdateSection(id!);
  const deleteSectionMutation = useDeleteSection(id!);

  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    domain: "code",
    language: "en" as "en" | "hi" | "hinglish",
    learningMode: "recorded" as "live" | "recorded" | "hybrid",
    level: "beginner" as "beginner" | "intermediate" | "advanced" | "all-levels",
    tagsInput: "",
    status: "draft" as "draft" | "published" | "archived",
    price: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Section Management State
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription || "",
        domain: course.domain || "code",
        language: course.language || "en",
        learningMode: course.learningMode || "recorded",
        level: course.level || "beginner",
        tagsInput: course.tags ? course.tags.join(", ") : "",
        status: course.status || "draft",
        price: course.price || 0,
      });
      if (course.thumbnail) {
        setThumbnailPreview(course.thumbnail);
      }
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
      <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
        <DashboardSidebar variant={user?.role === "admin" ? "admin" : "student"} />
        <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-[24px] font-semibold text-ink mb-3">Course Not Found</h2>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </main>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
        <DashboardSidebar variant={user?.role === "admin" ? "admin" : "student"} />
        <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-[24px] font-semibold text-error mb-3">Access Denied</h2>
            <p className="text-t2 mb-6">You don't have permission to edit this course.</p>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        </main>
      </div>
    );
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Thumbnail must be under 2 MB.");
      return;
    }
    
    // Preview the file locally immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setError("");
    thumbnailMutation.mutate(file, {
      onSuccess: () => {
        setSuccess("Thumbnail updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      },
      onError: (err: any) => {
        setError(err?.response?.data?.message ?? "Failed to update thumbnail.");
        // Revert preview on error
        setThumbnailPreview(course.thumbnail ?? null);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

    updateMutation.mutate(
      {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        domain: form.domain,
        language: form.language,
        learningMode: form.learningMode,
        level: form.level,
        tags,
        status: form.status,
        price: Number(form.price),
      },
      {
        onSuccess: () => {
          setSuccess("Course details updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to update course."),
      }
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        navigate("/dashboard");
      },
      onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to delete course."),
    });
  };

  /* ── Section Handlers ── */
  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;
    const position = course?.sections ? course.sections.length : 0;
    
    createSectionMutation.mutate({ title: sectionTitle, position }, {
      onSuccess: () => {
        setIsCreatingSection(false);
        setSectionTitle("");
        setSuccess("Section created.");
        setTimeout(() => setSuccess(""), 3000);
      },
      onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to create section."),
    });
  };

  const handleUpdateSection = (sectionId: string) => {
    if (!sectionTitle.trim()) {
      setEditingSectionId(null);
      return;
    }
    updateSectionMutation.mutate({ sectionId, payload: { title: sectionTitle } }, {
      onSuccess: () => {
        setEditingSectionId(null);
        setSectionTitle("");
        setSuccess("Section updated.");
        setTimeout(() => setSuccess(""), 3000);
      },
      onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to update section."),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this section? All its lectures will be deleted.")) return;
    deleteSectionMutation.mutate(sectionId, {
      onSuccess: () => {
        setSuccess("Section deleted.");
        setTimeout(() => setSuccess(""), 3000);
      },
      onError: (err: any) => setError(err?.response?.data?.message ?? "Failed to delete section."),
    });
  };

  return (
    <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)] bg-canvas">
      <DashboardSidebar variant={user?.role === "admin" ? "admin" : "student"} />

      <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5">
        <div className="max-w-[800px]">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-t3 text-[13.5px] mb-2 font-mono">
              <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
              <span>/</span>
              <Link to={`/courses/${id}`} className="hover:text-ink transition-colors">{(course as any).slug ?? id}</Link>
              <span>/</span>
              <span className="text-ink font-medium">Edit</span>
            </div>
            <h1 className="font-display font-semibold text-[26px] text-ink mb-1">
              Edit Course
            </h1>
            <p className="text-[13.5px] text-t2">
              Update your course details and thumbnail.
            </p>
          </div>

          {(error || updateMutation.isError || thumbnailMutation.isError) && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md text-[13.5px] text-error font-medium">
              {error || "An error occurred."}
            </div>
          )}
          
          {(success || updateMutation.isSuccess) && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-md text-[13.5px] text-success font-medium">
              {success || "Changes saved successfully."}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
            
            {/* Form Section */}
            <div className="bg-paper border border-line rounded-md p-[26px]">
              <h2 className="font-display font-semibold text-[18px] text-ink mb-5">Course Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="title" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                    Course Title <span className="text-error">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                    Short Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="shortDescription"
                    required
                    maxLength={180}
                    rows={2}
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="w-full bg-paper border border-line rounded-sm p-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors resize-none"
                  />
                  <p className="text-[11px] text-t3 mt-1 text-right">
                    {form.shortDescription.length} / 180 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                    Full Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-paper border border-line rounded-sm p-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors resize-y min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="domain" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Domain <span className="text-error">*</span>
                    </label>
                    <select
                      id="domain"
                      value={form.domain}
                      onChange={(e) => setForm({ ...form, domain: e.target.value })}
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
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
                    <label htmlFor="price" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Price (INR)
                    </label>
                    <input
                      id="price"
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="level" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Level
                    </label>
                    <select
                      id="level"
                      value={form.level}
                      onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all-levels">All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="language" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Language
                    </label>
                    <select
                      id="language"
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value as any })}
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="hinglish">Hinglish</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="learningMode" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Learning Mode
                    </label>
                    <select
                      id="learningMode"
                      value={form.learningMode}
                      onChange={(e) => setForm({ ...form, learningMode: e.target.value as any })}
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    >
                      <option value="recorded">Recorded</option>
                      <option value="live">Live</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tags" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Tags (comma-separated)
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={form.tagsInput}
                      onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                      placeholder="e.g. react, node, state-management"
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block font-mono text-[11.5px] text-t3 mb-[7px]">
                      Status
                    </label>
                    <select
                      id="status"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateMutation.isPending}
                    className="min-w-[140px]"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Details"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Curriculum / Sections Section */}
            <div className="bg-paper border border-line rounded-md p-[26px]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-semibold text-[18px] text-ink">Curriculum</h2>
                  <p className="text-[12.5px] text-t3 mt-1">Manage sections and lectures</p>
                </div>
                {!isCreatingSection && (
                  <Button variant="ghost" size="sm" onClick={() => { setIsCreatingSection(true); setSectionTitle(""); }}>
                    <Plus className="w-4 h-4" /> Add Section
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {/* Sections List */}
                {course.sections && course.sections.length > 0 ? (
                  course.sections.map((sec) => (
                    <div key={sec._id} className="border border-line rounded-md p-3 flex justify-between items-center bg-canvas">
                      {editingSectionId === sec._id ? (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <input
                            type="text"
                            autoFocus
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            className="flex-1 h-9 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateSection(sec._id);
                              if (e.key === "Escape") setEditingSectionId(null);
                            }}
                          />
                          <button onClick={() => handleUpdateSection(sec._id)} className="text-success hover:bg-success/10 p-1.5 rounded-sm transition-colors" title="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingSectionId(null)} className="text-t3 hover:bg-line p-1.5 rounded-sm transition-colors" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-[13.5px] text-ink">{sec.title}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingSectionId(sec._id);
                                setSectionTitle(sec.title);
                                setIsCreatingSection(false);
                              }}
                              className="text-t3 hover:text-ink p-1.5 rounded-sm hover:bg-line transition-colors"
                              title="Edit section"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSection(sec._id)}
                              className="text-t3 hover:text-error p-1.5 rounded-sm hover:bg-error/10 transition-colors"
                              title="Delete section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  !isCreatingSection && (
                    <div className="text-center py-6 border border-dashed border-line rounded-md">
                      <p className="text-[13px] text-t3">No sections yet. Add your first section to start building the curriculum.</p>
                    </div>
                  )
                )}

                {/* Create Section Form */}
                {isCreatingSection && (
                  <form onSubmit={handleCreateSection} className="border border-line rounded-md p-3 flex justify-between items-center bg-canvas">
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Section title (e.g. 'Introduction')"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                        className="flex-1 h-9 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setIsCreatingSection(false);
                            setSectionTitle("");
                          }
                        }}
                      />
                      <button type="submit" disabled={!sectionTitle.trim()} className="text-success hover:bg-success/10 p-1.5 rounded-sm transition-colors disabled:opacity-50" title="Save">
                        <Check className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => { setIsCreatingSection(false); setSectionTitle(""); }} className="text-t3 hover:bg-line p-1.5 rounded-sm transition-colors" title="Cancel">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Section */}
            <div className="space-y-6">
              
              {/* Thumbnail Section */}
              <div className="bg-paper border border-line rounded-md p-[22px]">
                <h2 className="font-display font-semibold text-[18px] text-ink mb-4">Thumbnail</h2>
                <div className="mb-4 aspect-video rounded-sm overflow-hidden bg-canvas border border-line flex items-center justify-center relative">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Course Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-t3 text-[40px]">◈</div>
                  )}
                  {thumbnailMutation.isPending && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
                    disabled={thumbnailMutation.isPending}
                    title="Upload new thumbnail"
                  />
                  <Button variant="ghost" block disabled={thumbnailMutation.isPending}>
                    {thumbnailMutation.isPending ? "Uploading..." : "Upload New Image"}
                  </Button>
                </div>
                <p className="font-mono text-[11px] text-t3 mt-3 text-center">
                  JPG, PNG or WebP · Max 2 MB
                </p>
              </div>

              {/* Danger Zone */}
              <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-md p-[22px]">
                <h2 className="font-display font-semibold text-[18px] text-error mb-2">Danger Zone</h2>
                <p className="text-[12.5px] text-[#D93025] mb-5 leading-relaxed">
                  Permanently delete this course and all associated lectures. This action cannot be undone.
                </p>
                <Button 
                  variant="ghost" 
                  block 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="!text-error !bg-error/10 hover:!bg-error/20"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete Course"}
                </Button>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default EditCoursePage;
