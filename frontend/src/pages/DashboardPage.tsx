/* /dashboard — Student dashboard
   Spec: Sidebar §10, DashHead, KPI row §11, ProgressCards §12 */

import { useNavigate } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";
import { useAuthStore } from "../store/authStore";
import DashboardSidebar from "../components/DashboardSidebar";
import KpiCard from "../components/KpiCard";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: courses = [] } = useCourses();

  if (!user) return null;
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
      <DashboardSidebar variant="student" />

      <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5">
        {/* Dash head */}
        <div className="flex justify-between items-start flex-wrap gap-[14px] mb-7">
          <div>
            <h1 className="font-display font-semibold text-[26px] text-ink">Welcome back, {firstName}</h1>
            <p className="text-t2 text-[13.5px] mt-[5px]">Keep your streak going — one lesson a day adds up fast.</p>
          </div>
          <Button variant="primary" size="md" onClick={() => navigate("/courses")} id="dash-browse-btn">
            Browse courses →
          </Button>
        </div>

        {/* KPI row §11 — 4 across desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Enrolled courses"   value="0"   delta="Enroll in a course to start" deltaDir="flat" />
          <KpiCard label="Hours learned"      value="0h"  delta="Track as you watch"           deltaDir="flat" />
          <KpiCard label="Lessons completed"  value="0"   delta="—"                            deltaDir="flat" />
          <KpiCard label="Certificates"       value="0"   delta="Complete a course"             deltaDir="flat" />
        </div>

        {/* Continue learning §12 */}
        <SectionHeader eyebrow="your progress" heading="Continue learning" />

        <div className="max-w-2xl">
          {/* Empty state until enrollment is implemented */}
          <div className="bg-paper border border-line rounded-md p-8 text-center">
            <p className="font-display text-[20px] font-semibold text-ink mb-2">No courses yet</p>
            <p className="text-t2 text-[13.5px] mb-5">
              Enroll in a course to start tracking your progress here.
            </p>
            <Button variant="primary" size="md" onClick={() => navigate("/courses")} id="dash-enroll-btn">
              Browse courses
            </Button>
          </div>
        </div>

        {/* Available courses teaser */}
        {courses.length > 0 && (
          <div className="mt-10">
            <SectionHeader eyebrow="explore" heading="Available to learn" seeAllTo="/courses" />
            <p className="text-t2 text-[13.5px]">
              {courses.length} course{courses.length !== 1 ? "s" : ""} available — find your next subject.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
