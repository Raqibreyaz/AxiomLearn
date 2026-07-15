import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  useCourse,
  useUpdateCourse,
  useUpdateThumbnail,
  useDeleteCourse,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCreateLecture,
  useUpdateLecture,
  useDeleteLecture,
} from "../hooks/useCourses";
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Video,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardSidebar from "../components/DashboardSidebar";
import Button from "../components/Button";
import axios from "axios";

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

  const createLectureMutation = useCreateLecture(id!);
  const updateLectureMutation = useUpdateLecture(id!);
  const deleteLectureMutation = useDeleteLecture(id!);

  const [activeTab, setActiveTab] = useState<
    "details" | "curriculum" | "settings"
  >("details");

  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    domain: "code",
    language: "en" as "en" | "hi" | "hinglish",
    learningMode: "recorded" as "live" | "recorded" | "hybrid",
    level: "beginner" as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "all-levels",
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

  // Lecture Management State
  const [creatingLectureForSection, setCreatingLectureForSection] = useState<
    string | null
  >(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureFile, setLectureFile] = useState<File | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [editLectureTitle, setEditLectureTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

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

      // Expand all sections by default
      if (course.sections) {
        const expanded: { [key: string]: boolean } = {};
        course.sections.forEach((s) => (expanded[s._id] = true));
        setExpandedSections((prev) => ({ ...expanded, ...prev }));
      }
    }
  }, [course]);

  const canEdit =
    user &&
    course &&
    (user._id === course.instructor?._id ||
      user.role === "admin" ||
      user.role === "owner");

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!course) {
    return (
      <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
        <DashboardSidebar
          variant={user?.role === "admin" ? "admin" : "student"}
        />
        <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-[24px] font-semibold text-ink mb-3">
              Course Not Found
            </h2>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
        <DashboardSidebar
          variant={user?.role === "admin" ? "admin" : "student"}
        />
        <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-[24px] font-semibold text-error mb-3">
              Access Denied
            </h2>
            <p className="text-t2 mb-6">
              You don't have permission to edit this course.
            </p>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Thumbnail must be under 2 MB.");
      return;
    }

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
        setThumbnailPreview(course.thumbnail ?? null);
      },
    });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.shortDescription.trim() ||
      !form.domain.trim()
    ) {
      setError(
        "Title, description, short description, and domain are required.",
      );
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
      { ...form, tags, price: Number(form.price) },
      {
        onSuccess: () => {
          setSuccess("Course details updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message ?? "Failed to update course."),
      },
    );
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { status: form.status },
      {
        onSuccess: () => {
          setSuccess("Course settings updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err: any) =>
          setError(
            err?.response?.data?.message ?? "Failed to update course settings.",
          ),
      },
    );
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    )
      return;
    deleteMutation.mutate(id!, {
      onSuccess: () => navigate("/dashboard"),
      onError: (err: any) =>
        setError(err?.response?.data?.message ?? "Failed to delete course."),
    });
  };

  /* ── Section Handlers ── */
  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;
    const position = course?.sections ? course.sections.length : 0;

    createSectionMutation.mutate(
      { title: sectionTitle, position },
      {
        onSuccess: () => {
          setIsCreatingSection(false);
          setSectionTitle("");
          setSuccess("Section created.");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message ?? "Failed to create section."),
      },
    );
  };

  const handleUpdateSection = (sectionId: string) => {
    if (!sectionTitle.trim()) {
      setEditingSectionId(null);
      return;
    }
    updateSectionMutation.mutate(
      { sectionId, payload: { title: sectionTitle } },
      {
        onSuccess: () => {
          setEditingSectionId(null);
          setSectionTitle("");
          setSuccess("Section updated.");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message ?? "Failed to update section."),
      },
    );
  };

  const handleDeleteSection = (sectionId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this section? All its lectures will be deleted.",
      )
    )
      return;
    deleteSectionMutation.mutate(sectionId, {
      onSuccess: () => {
        setSuccess("Section deleted.");
        setTimeout(() => setSuccess(""), 3000);
      },
      onError: (err: any) =>
        setError(err?.response?.data?.message ?? "Failed to delete section."),
    });
  };

  /* ── Lecture Handlers ── */
  const handleCreateLecture = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!lectureTitle.trim() || !lectureFile) return;

    // Helper to get video duration
    const getVideoDuration = (file: File): Promise<number> => {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          resolve(Math.round(video.duration));
        };
        video.onerror = () => {
          URL.revokeObjectURL(video.src);
          resolve(0);
        };
        video.src = URL.createObjectURL(file);
      });
    };

    const duration = await getVideoDuration(lectureFile);

    const section = course.sections?.find((s) => s._id === sectionId);
    const position = section?.lectures ? section.lectures.length : 0;

    createLectureMutation.mutate(
      {
        sectionId,
        payload: {
          title: lectureTitle,
          position,
          fileType: lectureFile.type,
          fileSize: lectureFile.size,
          duration,
        },
      },
      {
        onSuccess: async (data) => {
          // Capture the file reference BEFORE clearing state,
          // because setLectureFile(null) would lose it on next render
          const fileToUpload = lectureFile!;

          setCreatingLectureForSection(null);
          setLectureTitle("");
          setLectureFile(null);

          const lectureId = data.lecture._id;
          const uploadUrl = data.uploadUrl;

          setUploadProgress((prev) => ({ ...prev, [lectureId]: 0 }));

          try {
            await axios.put(uploadUrl, fileToUpload, {
              withCredentials: false,
              headers: {
                "Content-Type": fileToUpload.type,
                Accept: undefined,
              },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) /
                    (progressEvent.total || fileToUpload.size),
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  [lectureId]: percentCompleted,
                }));
              },
            });

            // Mark upload complete
            updateLectureMutation.mutate({
              sectionId,
              lectureId,
              payload: { isUploading: false },
            });

            setSuccess("Lecture created and uploaded successfully.");
            setTimeout(() => setSuccess(""), 3000);
          } catch (err: any) {
            console.error("S3 upload failed:", err);
            setError("Failed to upload lecture video. " + (err?.message ?? ""));
          } finally {
            // Clean up progress indicator regardless of success/failure
            setUploadProgress((prev) => {
              const next = { ...prev };
              delete next[lectureId];
              return next;
            });
          }
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message ?? "Failed to create lecture."),
      },
    );
  };

  const handleUpdateLectureTitle = (sectionId: string, lectureId: string) => {
    if (!editLectureTitle.trim()) {
      setEditingLectureId(null);
      return;
    }
    updateLectureMutation.mutate(
      { sectionId, lectureId, payload: { title: editLectureTitle } },
      {
        onSuccess: () => {
          setEditingLectureId(null);
          setEditLectureTitle("");
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message ?? "Failed to update lecture."),
      },
    );
  };

  const handleTogglePreview = (
    sectionId: string,
    lectureId: string,
    currentIsPreview: boolean,
  ) => {
    updateLectureMutation.mutate(
      { sectionId, lectureId, payload: { isPreview: !currentIsPreview } },
      {
        onError: (err: any) =>
          setError(
            err?.response?.data?.message ?? "Failed to update lecture preview.",
          ),
      },
    );
  };

  const handleDeleteLecture = (sectionId: string, lectureId: string) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;
    deleteLectureMutation.mutate(
      { sectionId, lectureId },
      {
        onSuccess: () => {
          setSuccess("Lecture deleted.");
          setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message ?? "Failed to delete lecture."),
      },
    );
  };

  return (
    <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)] bg-canvas">
      <DashboardSidebar
        variant={user?.role === "admin" ? "admin" : "student"}
      />

      <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 text-t3 text-[13.5px] mb-2 font-mono">
              <Link
                to="/dashboard"
                className="hover:text-ink transition-colors"
              >
                Dashboard
              </Link>
              <span>/</span>
              <Link
                to={`/courses/${id}`}
                className="hover:text-ink transition-colors"
              >
                {id}
              </Link>
              <span>/</span>
              <span className="text-ink font-medium">Edit</span>
            </div>
            <h1 className="font-display font-semibold text-[26px] text-ink mb-1">
              Course Workspace
            </h1>
            <p className="text-[13.5px] text-t2">
              Manage your course details, curriculum, and settings.
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

          {/* Tabs Navigation */}
          <div className="flex items-center gap-6 border-b border-line mb-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${activeTab === "details" ? "border-axiom text-axiom" : "border-transparent text-t2 hover:text-ink"}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${activeTab === "curriculum" ? "border-axiom text-axiom" : "border-transparent text-t2 hover:text-ink"}`}
            >
              Curriculum Builder
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${activeTab === "settings" ? "border-axiom text-axiom" : "border-transparent text-t2 hover:text-ink"}`}
            >
              Settings
            </button>
          </div>

          {/* Tab 1: Details */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
              <div className="bg-paper border border-line rounded-md p-[26px]">
                <h2 className="font-display font-semibold text-[18px] text-ink mb-5">
                  Course Details
                </h2>
                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="title"
                      className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                    >
                      Course Title <span className="text-error">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="shortDescription"
                      className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                    >
                      Short Description <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="shortDescription"
                      required
                      maxLength={180}
                      rows={2}
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm({ ...form, shortDescription: e.target.value })
                      }
                      className="w-full bg-paper border border-line rounded-sm p-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                    >
                      Full Description <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={6}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full bg-paper border border-line rounded-sm p-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors resize-y min-h-[120px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="domain"
                        className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                      >
                        Domain <span className="text-error">*</span>
                      </label>
                      <select
                        id="domain"
                        value={form.domain}
                        onChange={(e) =>
                          setForm({ ...form, domain: e.target.value })
                        }
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
                      <label
                        htmlFor="price"
                        className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                      >
                        Price (INR)
                      </label>
                      <input
                        id="price"
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: Number(e.target.value) })
                        }
                        className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="level"
                        className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                      >
                        Level
                      </label>
                      <select
                        id="level"
                        value={form.level}
                        onChange={(e) =>
                          setForm({ ...form, level: e.target.value as any })
                        }
                        className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="all-levels">All Levels</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="language"
                        className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        value={form.language}
                        onChange={(e) =>
                          setForm({ ...form, language: e.target.value as any })
                        }
                        className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="hinglish">Hinglish</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="learningMode"
                        className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                      >
                        Learning Mode
                      </label>
                      <select
                        id="learningMode"
                        value={form.learningMode}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            learningMode: e.target.value as any,
                          })
                        }
                        className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                      >
                        <option value="recorded">Recorded</option>
                        <option value="live">Live</option>
                        <option value="hybrid">Hybrid</option>
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

              {/* Sidebar: Thumbnail */}
              <div className="space-y-6">
                <div className="bg-paper border border-line rounded-md p-[22px]">
                  <h2 className="font-display font-semibold text-[18px] text-ink mb-4">
                    Thumbnail
                  </h2>
                  <div className="mb-4 aspect-video rounded-sm overflow-hidden bg-canvas border border-line flex items-center justify-center relative">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                      />
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
                    <Button
                      variant="ghost"
                      block
                      disabled={thumbnailMutation.isPending}
                    >
                      {thumbnailMutation.isPending
                        ? "Uploading..."
                        : "Upload New Image"}
                    </Button>
                  </div>
                  <p className="font-mono text-[11px] text-t3 mt-3 text-center">
                    JPG, PNG or WebP · Max 2 MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Curriculum Builder */}
          {activeTab === "curriculum" && (
            <div className="bg-paper border border-line rounded-md p-[26px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display font-semibold text-[20px] text-ink">
                    Curriculum Builder
                  </h2>
                  <p className="text-[13.5px] text-t3 mt-1">
                    Organize your course content logically. Build sections and
                    add lectures.
                  </p>
                </div>
                {!isCreatingSection && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsCreatingSection(true);
                      setSectionTitle("");
                    }}
                  >
                    <Plus className="w-4 h-4" /> Add Section
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Sections List */}
                {course.sections && course.sections.length > 0
                  ? course.sections.map((sec) => (
                      <div
                        key={sec._id}
                        className="border border-line rounded-md bg-canvas overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="px-4 py-3 bg-paper border-b border-line flex justify-between items-center">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => toggleSection(sec._id)}
                              className="text-t3 hover:text-ink"
                            >
                              {expandedSections[sec._id] ? "▼" : "▶"}
                            </button>
                            {editingSectionId === sec._id ? (
                              <div className="flex items-center gap-2 flex-1 mr-4">
                                <input
                                  type="text"
                                  autoFocus
                                  value={sectionTitle}
                                  onChange={(e) =>
                                    setSectionTitle(e.target.value)
                                  }
                                  className="flex-1 h-8 bg-canvas border border-line rounded-sm px-2 text-[13.5px] text-ink focus:outline-none focus:border-axiom"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleUpdateSection(sec._id);
                                    if (e.key === "Escape")
                                      setEditingSectionId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdateSection(sec._id)}
                                  className="text-success hover:bg-success/10 p-1 rounded-sm"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingSectionId(null)}
                                  className="text-t3 hover:bg-line p-1 rounded-sm"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <h3 className="font-semibold text-[15px] text-ink">
                                {sec.title}
                              </h3>
                            )}
                          </div>
                          {editingSectionId !== sec._id && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingSectionId(sec._id);
                                  setSectionTitle(sec.title);
                                }}
                                className="text-t3 hover:text-ink p-1.5 rounded-sm hover:bg-line transition-colors"
                                title="Edit section"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSection(sec._id)}
                                className="text-t3 hover:text-error p-1.5 rounded-sm hover:bg-error/10 transition-colors"
                                title="Delete section"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Section Lectures */}
                        {expandedSections[sec._id] && (
                          <div className="p-4 space-y-3">
                            {sec.lectures && sec.lectures.length > 0 ? (
                              sec.lectures.map((lec) => (
                                <div
                                  key={lec._id}
                                  className="group border border-line bg-paper rounded-sm p-3 flex flex-col gap-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 flex-1">
                                      <Video className="w-4 h-4 text-t3" />
                                      {editingLectureId === lec._id ? (
                                        <div className="flex items-center gap-2 flex-1 mr-4">
                                          <input
                                            type="text"
                                            autoFocus
                                            value={editLectureTitle}
                                            onChange={(e) =>
                                              setEditLectureTitle(
                                                e.target.value,
                                              )
                                            }
                                            className="flex-1 h-8 bg-canvas border border-line rounded-sm px-2 text-[13px] text-ink focus:outline-none focus:border-axiom"
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter")
                                                handleUpdateLectureTitle(
                                                  sec._id,
                                                  lec._id,
                                                );
                                              if (e.key === "Escape")
                                                setEditingLectureId(null);
                                            }}
                                          />
                                          <button
                                            onClick={() =>
                                              handleUpdateLectureTitle(
                                                sec._id,
                                                lec._id,
                                              )
                                            }
                                            className="text-success hover:bg-success/10 p-1 rounded-sm"
                                          >
                                            <Check className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              setEditingLectureId(null)
                                            }
                                            className="text-t3 hover:bg-line p-1 rounded-sm"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="text-[14px] text-ink font-medium">
                                          {lec.title}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <label className="flex items-center gap-1.5 text-[12px] text-t2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={lec.isPreview}
                                          onChange={() =>
                                            handleTogglePreview(
                                              sec._id,
                                              lec._id,
                                              lec.isPreview,
                                            )
                                          }
                                          className="accent-axiom"
                                        />
                                        Free Preview
                                      </label>
                                      <div className="w-[1px] h-4 bg-line mx-1"></div>
                                      <button
                                        onClick={() => {
                                          setEditingLectureId(lec._id);
                                          setEditLectureTitle(lec.title);
                                        }}
                                        className="text-t3 hover:text-ink transition-colors"
                                        title="Edit title"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteLecture(sec._id, lec._id)
                                        }
                                        className="text-t3 hover:text-error transition-colors"
                                        title="Delete lecture"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  {/* Upload progress or status */}
                                  {(lec.isUploading ||
                                    uploadProgress[lec._id] !== undefined) &&
                                  uploadProgress[lec._id] < 100 ? (
                                    <div className="flex items-center gap-3 mt-1">
                                      <div className="flex-1 bg-line h-1.5 rounded-full overflow-hidden">
                                        <div
                                          className="bg-axiom h-full transition-all"
                                          style={{
                                            width: `${uploadProgress[lec._id] || 0}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-[11px] font-mono text-t2">
                                        {uploadProgress[lec._id] || 0}%
                                      </span>
                                    </div>
                                  ) : lec.isUploading ? (
                                    <div className="flex items-center gap-1 text-[11px] text-axiom mt-1">
                                      <LoadingSpinner /> Processing Video...
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-[11px] text-success mt-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                      Video Ready
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-[12.5px] text-t3 italic mb-2">
                                No lectures in this section yet.
                              </p>
                            )}

                            {creatingLectureForSection === sec._id ? (
                              <form
                                onSubmit={(e) =>
                                  handleCreateLecture(e, sec._id)
                                }
                                className="border border-line bg-paper rounded-sm p-3 mt-2 space-y-3"
                              >
                                <h4 className="text-[13px] font-medium text-ink">
                                  Add New Lecture
                                </h4>
                                <input
                                  type="text"
                                  autoFocus
                                  required
                                  placeholder="Lecture title"
                                  value={lectureTitle}
                                  onChange={(e) =>
                                    setLectureTitle(e.target.value)
                                  }
                                  className="w-full h-9 bg-canvas border border-line rounded-sm px-3 text-[13px] text-ink focus:outline-none focus:border-axiom"
                                />
                                <div className="flex items-center gap-3">
                                  <label className="flex-1 flex items-center justify-center gap-2 h-9 border border-dashed border-line rounded-sm text-[12.5px] text-t2 hover:bg-canvas cursor-pointer transition-colors">
                                    <UploadCloud className="w-4 h-4" />
                                    {lectureFile
                                      ? lectureFile.name
                                      : "Select Video File"}
                                    <input
                                      type="file"
                                      accept="video/mp4,video/webm"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setLectureFile(file);
                                        if (file && !lectureTitle.trim()) {
                                          // Default title to the file name without extension
                                          setLectureTitle(file.name.replace(/\.[^/.]+$/, ""));
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setCreatingLectureForSection(null);
                                      setLectureFile(null);
                                      setLectureTitle("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={
                                      !lectureTitle.trim() ||
                                      !lectureFile ||
                                      createLectureMutation.isPending
                                    }
                                  >
                                    {createLectureMutation.isPending
                                      ? "Uploading..."
                                      : "Add Lecture"}
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCreatingLectureForSection(sec._id);
                                  setLectureTitle("");
                                  setLectureFile(null);
                                }}
                                className="mt-2 text-t2"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Lecture
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  : !isCreatingSection && (
                      <div className="text-center py-10 border border-dashed border-line rounded-md">
                        <p className="text-[14px] text-t2 mb-3">
                          Your curriculum is empty.
                        </p>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsCreatingSection(true);
                            setSectionTitle("");
                          }}
                        >
                          <Plus className="w-4 h-4" /> Add First Section
                        </Button>
                      </div>
                    )}

                {/* Create Section Form */}
                {isCreatingSection && (
                  <form
                    onSubmit={handleCreateSection}
                    className="border border-axiom border-dashed bg-canvas rounded-md p-4"
                  >
                    <h4 className="text-[13px] font-medium text-ink mb-2">
                      New Section
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="e.g. 'Introduction'"
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
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={!sectionTitle.trim()}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsCreatingSection(false);
                          setSectionTitle("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Settings */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="bg-paper border border-line rounded-md p-[26px]">
                <h2 className="font-display font-semibold text-[18px] text-ink mb-5">
                  Course Status
                </h2>
                <form onSubmit={handleSettingsSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="status"
                      className="block font-mono text-[11.5px] text-t3 mb-[7px]"
                    >
                      Visibility Status
                    </label>
                    <select
                      id="status"
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value as any })
                      }
                      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink focus:outline-none focus:border-axiom transition-colors"
                    >
                      <option value="draft">Draft (Hidden)</option>
                      <option value="published">Published (Public)</option>
                      <option value="archived">Archived (Unlisted)</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-md p-[26px]">
                <h2 className="font-display font-semibold text-[18px] text-error mb-2">
                  Danger Zone
                </h2>
                <p className="text-[13.5px] text-[#D93025] mb-6 leading-relaxed">
                  Permanently delete this course and all associated lectures.
                  This action cannot be undone.
                </p>
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="!text-error !bg-error/10 hover:!bg-error/20"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete Course"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditCoursePage;
