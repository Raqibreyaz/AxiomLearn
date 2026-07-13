/* /login — Modal spec §15 rendered as full page */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginPayload } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => { setUser(user); navigate("/dashboard"); },
    onError: (err: any) => setError(err?.response?.data?.message ?? "Invalid email or password."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Panel — matches modal spec §15 anatomy */}
        <div className="bg-paper rounded-lg overflow-hidden shadow-modal">
          <div className="px-[22px] py-[18px] border-b border-line">
            <h1 className="font-display font-semibold text-[18px] text-ink">Log in</h1>
          </div>

          <div className="p-[22px]">
            {error && (
              <div className="mb-4 px-3 py-[10px] rounded-sm bg-danger-tint text-danger text-[13px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-[14px]">
              {/* Email field §15 */}
              <div>
                <label className="font-mono text-[11.5px] text-t3 block mb-[7px]">Email</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full h-11 bg-paper-sunken border border-line rounded-sm px-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors"
                />
              </div>

              {/* Password field */}
              <div>
                <label className="font-mono text-[11.5px] text-t3 block mb-[7px]">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-11 bg-paper-sunken border border-line rounded-sm px-3 pr-10 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-t3 hover:text-t2"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                block
                disabled={mutation.isPending}
                id="login-submit-btn"
              >
                {mutation.isPending ? "Logging in…" : "Log in"}
              </Button>
            </form>

            {/* Footer link — §15 centered 12.5px */}
            <p className="text-[12.5px] text-t2 text-center mt-[14px]">
              No account?{" "}
              <Link to="/signup" className="text-axiom hover:underline" id="login-signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
