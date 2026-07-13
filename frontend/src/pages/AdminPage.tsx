/* /admin — Admin overview
   Spec: Sidebar §10 (admin variant), KPI §11, Courses table §13, Enrollments table */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";
import DashboardSidebar from "../components/DashboardSidebar";
import KpiCard from "../components/KpiCard";
import StatusPill from "../components/StatusPill";
import Button from "../components/Button";

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: courses = [], isLoading } = useCourses();

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const published = courses.filter((c) => (c as any).status !== "DRAFT").length;
  const draft = courses.length - published;

  return (
    <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
      <DashboardSidebar variant="admin" />

      <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5">
        {/* Dash head */}
        <div className="flex justify-between items-start flex-wrap gap-[14px] mb-7">
          <div>
            <h1 className="font-display font-semibold text-[26px] text-ink">Admin overview</h1>
            <p className="text-t2 text-[13.5px] mt-[5px]">Snapshot of catalogue health — live data.</p>
          </div>
          <Link to="/instructor/create-course">
            <Button variant="primary" size="md" id="admin-new-course-btn">+ New course</Button>
          </Link>
        </div>

        {/* KPI row §11 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Published courses" value={String(published)} delta={`${draft} in draft`} deltaDir="flat" />
          <KpiCard label="Total courses"     value={String(courses.length)} delta="in catalogue" deltaDir="flat" />
          <KpiCard label="Active students"   value="—"   delta="Enrollment API pending" deltaDir="flat" />
          <KpiCard label="Revenue"           value="—"   delta="Payments pending"        deltaDir="flat" />
        </div>

        {/* Courses table §13 */}
        <div className="flex justify-between items-center flex-wrap gap-3 mb-[18px]">
          <h2 className="font-display font-semibold text-[18px] text-ink">Courses</h2>
          <input
            type="text"
            placeholder="Search courses…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-paper border border-line rounded-sm px-3 py-[9px] text-[13px] text-ink font-body focus:outline-none focus:border-axiom transition-colors w-[220px]"
            id="admin-course-search"
          />
        </div>

        <div className="bg-paper border border-line rounded-md overflow-hidden mb-9">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {["Course", "Domain", "Price", "Status", ""].map((h) => (
                  <th key={h} className="font-mono text-[11px] text-t3 text-left px-[14px] py-[10px] border-b border-line uppercase tracking-[0.03em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-[14px] py-6 text-t3 text-center text-[13px]">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-[14px] py-6 text-t3 text-center text-[13px]">No courses found.</td></tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course._id} className="hover:bg-paper-sunken transition-colors">
                    <td className="px-[14px] py-[13px] border-b border-line">
                      <b className="font-semibold text-ink">{course.title}</b>
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line text-t2">
                      {(course as any).domain ?? "—"}
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line text-t2 font-mono">
                      {(course as any).price ? `₹${(course as any).price.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line">
                      <StatusPill
                        status={(course as any).status === "DRAFT" ? "warning" : "success"}
                        label={(course as any).status === "DRAFT" ? "Draft" : "Published"}
                      />
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line">
                      <div className="flex gap-[6px]">
                        <Link
                          to={`/instructor/courses/${course._id}/edit`}
                          className="w-7 h-7 rounded-sm bg-paper-sunken border border-line flex items-center justify-center text-t2 text-[13px] hover:text-ink hover:border-t3 transition-colors"
                          title="Edit course"
                        >
                          ✎
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enrollments placeholder */}
        <div className="flex justify-between items-center mb-[18px]">
          <h2 className="font-display font-semibold text-[18px] text-ink">Recent enrollments</h2>
        </div>
        <div className="bg-paper border border-line rounded-md overflow-hidden">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {["Student", "Course", "Amount", "Payment", "Date"].map((h) => (
                  <th key={h} className="font-mono text-[11px] text-t3 text-left px-[14px] py-[10px] border-b border-line uppercase tracking-[0.03em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-[14px] py-8 text-t3 text-center text-[13px]">
                  Enrollment API pending — will populate once implemented.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
