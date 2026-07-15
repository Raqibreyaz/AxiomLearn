import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import StatusPill from "../components/StatusPill";
import { useUsers, useUpdateUserRole } from "../hooks/useUsers";

interface AdminUsersPageProps {
  roleFilter: "student" | "instructor";
}

const AdminUsersPage = ({ roleFilter }: AdminUsersPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading } = useUsers();
  const { mutate: updateRole } = useUpdateUserRole();

  const filteredUsers = users.filter((user) => {
    const matchesRole = user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handlePromoteDemote = (userId: string, currentRole: string) => {
    const newRole = currentRole === "student" ? "instructor" : "student";
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateRole({ userId, role: newRole });
    }
  };

  return (
    <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
      <DashboardSidebar variant="admin" />

      <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5">
        <div className="flex justify-between items-start flex-wrap gap-[14px] mb-7">
          <div>
            <h1 className="font-display font-semibold text-[26px] text-ink capitalize">
              {roleFilter}s
            </h1>
            <p className="text-t2 text-[13.5px] mt-[5px]">
              Manage {roleFilter}s on the platform.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3 mb-[18px]">
          <h2 className="font-display font-semibold text-[18px] text-ink">Directory</h2>
          <input
            type="text"
            placeholder={`Search ${roleFilter}s…`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-paper border border-line rounded-sm px-3 py-[9px] text-[13px] text-ink font-body focus:outline-none focus:border-axiom transition-colors w-[220px]"
          />
        </div>

        <div className="bg-paper border border-line rounded-md overflow-hidden mb-9">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[11px] text-t3 text-left px-[14px] py-[10px] border-b border-line uppercase tracking-[0.03em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-[14px] py-6 text-t3 text-center text-[13px]">
                    Loading…
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-[14px] py-6 text-t3 text-center text-[13px]">
                    No {roleFilter}s found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-paper-sunken transition-colors">
                    <td className="px-[14px] py-[13px] border-b border-line">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-pill flex items-center justify-center text-xs font-bold bg-gradient-to-br from-axiom to-d-design text-white shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <b className="font-semibold text-ink">{user.name}</b>
                      </div>
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line text-t2">
                      {user.email}
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line">
                      <StatusPill
                        status={user.role === "instructor" ? "info" : "default"}
                        label={user.role}
                      />
                    </td>
                    <td className="px-[14px] py-[13px] border-b border-line">
                      <button
                        onClick={() => handlePromoteDemote(user._id, user.role)}
                        className="text-[13px] font-semibold text-axiom hover:text-axiom-tint transition-colors"
                      >
                        {user.role === "student" ? "Promote to Instructor" : "Demote to Student"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
