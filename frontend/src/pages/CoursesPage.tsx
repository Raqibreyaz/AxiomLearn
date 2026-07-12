import { useState } from "react";
import { Search, BookOpen, SlidersHorizontal } from "lucide-react";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CoursesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data: courses, isLoading, isError } = useCourses(appliedSearch || undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
            <span className="text-sm font-medium uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
              Catalogue
            </span>
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ color: "var(--color-text)" }}>
            All Courses
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
            Discover expert-led courses across every discipline.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "var(--color-text-dim)" }}
              />
              <input
                id="courses-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 rounded-xl text-sm glass input-glow transition-all duration-200"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  background: "transparent",
                }}
              />
            </div>
            <button
              id="courses-search-btn"
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-105 cursor-pointer"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--color-error)" }}>
              Failed to load courses
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Please check your connection and try again.
            </p>
          </div>
        ) : courses && courses.length > 0 ? (
          <>
            <p className="text-sm mb-6" style={{ color: "var(--color-text-dim)" }}>
              {courses.length} course{courses.length !== 1 ? "s" : ""} found
              {appliedSearch && ` for "${appliedSearch}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--color-primary-light)" }}
            >
              <BookOpen className="w-10 h-10" style={{ color: "var(--color-accent)" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
              No courses found
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {appliedSearch
                ? `No courses match "${appliedSearch}". Try a different search.`
                : "No courses available yet. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
