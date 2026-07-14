/* /dashboard/settings — Profile update + avatar upload
   Uses PATCH /auth/update and POST /auth/avatar */

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { authApi, type UpdateProfilePayload } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import DashboardSidebar from "../components/DashboardSidebar";
import Button from "../components/Button";

const SettingsPage = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Form state (seeded from current user) ── */
  const [form, setForm] = useState<UpdateProfilePayload>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
    phone: user?.phone ?? "",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Profile update mutation ── */
  const profileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSuccessMsg("Profile updated successfully.");
      setErrorMsg("");
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? "Failed to update profile.");
      setSuccessMsg("");
    },
  });

  /* ── Password change mutation ── */
  const passwordMutation = useMutation({
    mutationFn: (payload: { password: string; newPassword: string }) =>
      authApi.updateProfile(payload),
    onSuccess: () => {
      setPasswordForm({ password: "", newPassword: "", confirmPassword: "" });
      setSuccessMsg("Password changed successfully.");
      setErrorMsg("");
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? "Failed to change password.");
      setSuccessMsg("");
    },
  });

  /* ── Avatar upload mutation ── */
  const avatarMutation = useMutation({
    mutationFn: authApi.updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSuccessMsg("Avatar updated. Refresh to see changes.");
      setErrorMsg("");
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? "Failed to upload avatar.");
      setSuccessMsg("");
    },
  });

  /* ── Handlers ── */
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const payload: UpdateProfilePayload = {};
    if (form.name && form.name !== user?.name) payload.name = form.name;
    if (form.email && form.email !== user?.email) payload.email = form.email;
    if (form.bio !== undefined && form.bio !== (user?.bio ?? ""))
      payload.bio = form.bio;
    if (form.phone) payload.phone = form.phone;

    if (Object.keys(payload).length === 0) {
      setErrorMsg("No changes to save.");
      return;
    }
    profileMutation.mutate(payload);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (passwordForm.newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    passwordMutation.mutate({
      password: passwordForm.password,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Avatar must be under 2 MB.");
      return;
    }
    avatarMutation.mutate(file);
  };

  if (!user) return null;

  return (
    <div className="flex max-[920px]:flex-col min-h-[calc(100vh-64px)]">
      <DashboardSidebar variant="student" />

      <main className="flex-1 px-9 py-8 max-[920px]:px-4 max-[920px]:py-5">
        <h1 className="font-display font-semibold text-[26px] text-ink mb-1">
          Settings
        </h1>
        <p className="text-t2 text-[13.5px] mb-8">
          Manage your profile, avatar, and password.
        </p>

        {/* Status messages */}
        {successMsg && (
          <div className="mb-5 px-4 py-3 rounded-sm bg-success-tint text-success text-[13px]">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-5 px-4 py-3 rounded-sm bg-danger-tint text-danger text-[13px]">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* ── LEFT: Profile form ── */}
          <div className="space-y-6">
            {/* Avatar section */}
            <div className="bg-paper border border-line rounded-md p-6">
              <h2 className="font-display font-semibold text-[18px] text-ink mb-4">
                Avatar
              </h2>
              <div className="flex items-center gap-5">
                <div className="relative group">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-line"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-axiom to-d-design flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    disabled={avatarMutation.isPending}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <p className="text-[13.5px] text-ink font-medium">
                    {user.name}
                  </p>
                  <p className="font-mono text-[11px] text-t3 mt-1">
                    JPG, PNG or WebP · Max 2 MB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    disabled={avatarMutation.isPending}
                    className="mt-2"
                  >
                    {avatarMutation.isPending ? "Uploading…" : "Change avatar"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <form onSubmit={handleProfileSubmit}>
              <div className="bg-paper border border-line rounded-md p-6">
                <h2 className="font-display font-semibold text-[18px] text-ink mb-4">
                  Profile
                </h2>
                <div className="space-y-[14px]">
                  <Field
                    id="settings-name"
                    label="Full name"
                    value={form.name ?? ""}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Your name"
                  />
                  <Field
                    id="settings-email"
                    label="Email"
                    type="email"
                    value={form.email ?? ""}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="you@example.com"
                  />
                  <Field
                    id="settings-phone"
                    label="Phone (optional)"
                    type="tel"
                    value={form.phone ?? ""}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    placeholder="+91 98765 43210"
                  />
                  <div>
                    <label
                      htmlFor="settings-bio"
                      className="font-mono text-[11.5px] text-t3 block mb-[7px]"
                    >
                      Bio
                    </label>
                    <textarea
                      id="settings-bio"
                      rows={3}
                      value={form.bio ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself…"
                      className="w-full bg-paper border border-line rounded-sm px-3 py-2 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors resize-none"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={profileMutation.isPending}
                    id="settings-save-btn"
                  >
                    {profileMutation.isPending ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Password change */}
            <form onSubmit={handlePasswordSubmit}>
              <div className="bg-paper border border-line rounded-md p-6">
                <h2 className="font-display font-semibold text-[18px] text-ink mb-4">
                  Change password
                </h2>
                <div className="space-y-[14px]">
                  <Field
                    id="settings-current-pw"
                    label="Current password"
                    type="password"
                    value={passwordForm.password}
                    onChange={(v) =>
                      setPasswordForm({ ...passwordForm, password: v })
                    }
                    placeholder="••••••••"
                  />
                  <Field
                    id="settings-new-pw"
                    label="New password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(v) =>
                      setPasswordForm({ ...passwordForm, newPassword: v })
                    }
                    placeholder="Minimum 8 characters"
                  />
                  <Field
                    id="settings-confirm-pw"
                    label="Confirm new password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(v) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: v })
                    }
                    placeholder="Repeat new password"
                  />
                </div>
                <div className="mt-5 flex justify-end">
                  <Button
                    type="submit"
                    variant="danger"
                    size="md"
                    disabled={passwordMutation.isPending}
                    id="settings-change-pw-btn"
                  >
                    {passwordMutation.isPending
                      ? "Changing…"
                      : "Change password"}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Account info sidebar ── */}
          <div className="bg-paper border border-line rounded-md p-6">
            <h2 className="font-display font-semibold text-[18px] text-ink mb-4">
              Account
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-mono text-[11px] text-t3 uppercase tracking-[0.03em] block mb-1">
                  Role
                </span>
                <span className="text-[13.5px] text-ink capitalize">
                  {user.role}
                </span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-t3 uppercase tracking-[0.03em] block mb-1">
                  User ID
                </span>
                <span className="font-mono text-[12px] text-t2 break-all">
                  {user._id}
                </span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-t3 uppercase tracking-[0.03em] block mb-1">
                  Email
                </span>
                <span className="text-[13.5px] text-ink">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ── Shared field renderer ── */
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Field = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: FieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="font-mono text-[11.5px] text-t3 block mb-[7px]"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full h-11 bg-paper border border-line rounded-sm px-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors disabled:opacity-50"
    />
  </div>
);

export default SettingsPage;
