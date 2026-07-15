import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useCourse } from "../hooks/useCourses";
import { lecturesApi } from "../api/courses.api";
import { useAuthStore } from "../store/authStore";
import CurriculumAccordion, {
  type CurriculumSection,
  type Lesson,
} from "../components/CurriculumAccordion";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";


const CoursePlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  
  const { data: course, isLoading, isError } = useCourse(id!);

  const lessonIdParam = searchParams.get("lesson");





  const curriculum: CurriculumSection[] = useMemo(() => {
    if (!course?.sections) return [];
    return course.sections.map((sec) => ({
      title: sec.title,
      lessons: sec.lectures
        ? sec.lectures.map((lec) => ({
            id: lec._id,
            sectionId: sec._id,
            title: lec.title,
            durationSec: lec.lectureDurationSeconds || 0,
            isFreePreview: lec.isPreview,
            isLocked: !lec.isPreview && !user, // Very basic lock logic for now
          }))
        : [],
    }));
  }, [course, user]);

  // Update Lesson type to include sectionId locally
  type PlayerLesson = Lesson & { sectionId: string };

  const allLessons: PlayerLesson[] = useMemo(() => {
    return curriculum.flatMap(c => c.lessons as PlayerLesson[]);
  }, [curriculum]);

  const [activeLesson, setActiveLesson] = useState<PlayerLesson | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(false);

  // Sync active lesson with URL param, or default to first lesson
  useEffect(() => {
    if (allLessons.length === 0) return;

    if (lessonIdParam) {
      const lesson = allLessons.find(l => l.id === lessonIdParam);
      if (lesson) {
        setActiveLesson(lesson);
        return;
      }
    }
    
    // Default to first unlocked lesson
    const firstAvailable = allLessons.find(l => !l.isLocked) || allLessons[0];
    if (firstAvailable) {
      setActiveLesson(firstAvailable);
      setSearchParams({ lesson: firstAvailable.id }, { replace: true });
    }
  }, [lessonIdParam, allLessons, setSearchParams]);

  useEffect(() => {
    if (!activeLesson || !course?._id) return;

    let isMounted = true;
    setIsLoadingStream(true);
    setStreamUrl(null);

    const fetchStreamUrl = async () => {
      try {
        const url = await lecturesApi.getLectureStreamUrl(
          course._id,
          activeLesson.sectionId,
          activeLesson.id
        );
        if (isMounted) {
          setStreamUrl(url);
        }
      } catch (err) {
        console.error("Failed to fetch stream URL", err);
      } finally {
        if (isMounted) {
          setIsLoadingStream(false);
        }
      }
    };

    fetchStreamUrl();
    return () => { isMounted = false; };
  }, [activeLesson, course?._id]);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-display text-[28px] font-semibold text-ink mb-3">
          Course not found
        </h2>
        <Button variant="primary" onClick={() => navigate("/courses")}>
          Browse courses
        </Button>
      </div>
    );
  }

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setSearchParams({ lesson: lesson.id });
  };

  return (
    <div className="min-h-screen bg-ink-sunken text-ti1 flex flex-col">
      {/* ── Top Bar ── */}
      <header className="h-16 border-b border-line-ink flex items-center px-6 shrink-0 bg-ink z-10 relative">
        <Link 
          to={`/courses/${course._id}`} 
          className="text-ti2 hover:text-ti1 transition-colors flex items-center gap-2 font-mono text-[13px]"
        >
          <span className="text-[18px]">‹</span> Back to Course
        </Link>
        <div className="mx-auto font-display font-semibold text-[16px] text-white truncate max-w-[400px]">
          {course.title}
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Video Player Area */}
        <div className="flex-1 flex flex-col bg-black relative">
          <div className="flex-1 relative aspect-video lg:aspect-auto">
            {isLoadingStream ? (
              <div className="w-full h-full flex items-center justify-center text-ti3 text-[14px]">
                Loading video...
              </div>
            ) : activeLesson && streamUrl ? (
              <video
                key={activeLesson.id}
                src={streamUrl}
                controls
                autoPlay
                className="w-full h-full object-contain absolute inset-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ti3 text-[14px]">
                No lesson selected or failed to load.
              </div>
            )}
          </div>
          
          {/* Below video info */}
          <div className="bg-ink p-6 shrink-0 border-t border-line-ink">
            <h1 className="font-display font-semibold text-[24px] text-white mb-2">
              {activeLesson?.title || "Lesson Title"}
            </h1>
            {activeLesson?.isFreePreview && (
              <span className="font-mono text-[11px] text-axiom border border-axiom px-[8px] py-[3px] rounded-sm uppercase tracking-wider">
                Free Preview
              </span>
            )}
          </div>
        </div>

        {/* Right: Curriculum Sidebar */}
        <div className="w-full lg:w-[400px] shrink-0 bg-paper text-ink flex flex-col border-l border-line h-[50vh] lg:h-auto overflow-y-auto">
          <div className="p-5 border-b border-line bg-canvas sticky top-0 z-10">
            <h2 className="font-display font-semibold text-[18px]">Course Content</h2>
          </div>
          <div className="p-4">
            <CurriculumAccordion 
              sections={curriculum} 
              onLessonSelect={handleLessonSelect}
              activeLessonId={activeLesson?.id}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CoursePlayerPage;
