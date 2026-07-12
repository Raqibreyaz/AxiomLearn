import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, BookOpen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi, type SignupPayload } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

const SignupPage = () => {
  const [form, setForm] = useState<SignupPayload>({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (user) => {
      setUser(user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message ?? "Registration failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    signupMutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div
        className="fixed top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent)" }}
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
            Create account
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Join AxiomLearn and start learning today
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

            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl text-sm input-glow transition-all duration-200"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                Email address
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm input-glow transition-all duration-200"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
                <button
                  type="button"
                  id="signup-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity duration-200 hover:opacity-70 cursor-pointer"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background:
                          form.password.length >= i * 3
                            ? i <= 1 ? "var(--color-error)" : i <= 2 ? "var(--color-warning)" : "var(--color-success)"
                            : "var(--color-border)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
            >
              {signupMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--color-text-dim)" }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            id="signup-login-link"
            className="font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--color-accent)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
