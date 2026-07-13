/* /courses — paginated/filterable course catalogue
   Spec: Header §1 (in layout), SearchBar §4, CategoryChips §5, CourseCard grid §6 */

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";
import SearchBar from "../components/SearchBar";
import CategoryChips, { type Domain } from "../components/CategoryChips";
import CourseCard from "../components/CourseCard";
import SectionHeader from "../components/SectionHeader";
import Footer from "../components/Footer";

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDomain, setActiveDomain] = useState<Domain>("All");
  const searchQuery = searchParams.get("search") ?? "";

  const { data: courses = [], isLoading, isError } = useCourses(searchQuery || undefined);

  const filtered = courses.filter((c) => {
    if (activeDomain === "All") return true;
    return (c as any).domain?.toUpperCase() === activeDomain.toUpperCase();
  });

  const handleSearch = (q: string) => {
    setSearchParams(q ? { search: q } : {});
  };

  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-6 py-[72px]">
        <SectionHeader
          eyebrow="full catalogue"
          heading="All courses"
        />

        {/* Search bar §4 */}
        <div className="mb-8">
          <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
        </div>

        {/* Category chips §5 */}
        <div className="mb-8">
          <CategoryChips active={activeDomain} onChange={setActiveDomain} />
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="font-mono text-[11.5px] text-t3 mb-5">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
            {activeDomain !== "All" && ` in ${activeDomain}`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-paper border border-line rounded-md h-[260px] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-[17px] font-semibold text-ink mb-2">Failed to load courses</p>
            <p className="text-t2">Please check your connection and try again.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-[22px] font-semibold text-ink mb-2">No courses found</p>
            <p className="text-t2">
              {searchQuery ? `Try a different search term.` : "Check back soon — new courses are added weekly."}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CoursesPage;
