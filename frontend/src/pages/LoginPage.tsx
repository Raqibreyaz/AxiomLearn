import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, BookOpen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginPayload } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setUser(user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? "Invalid credentials. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background orbs */}
      <div
        className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent)" }}
      />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-sm"
            style={{ background: "linear-gradient(135deg, var(--color-primary), #5b21b6)" }}
          >
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-1" style={{ color: "var(--color-text)" }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Sign in to your AxiomLearn account
          </p>
        </div>

        {/* Form Card */}
        <div className="gradient-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Banner */}
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
                <button
                  type="button"
                  id="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity duration-200 hover:opacity-70 cursor-pointer"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
            >
              {loginMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            id="login-signup-link"
            className="font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--color-accent)" }}
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
