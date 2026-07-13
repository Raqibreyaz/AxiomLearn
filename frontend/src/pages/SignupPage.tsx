/* /signup — Modal spec §15 as full page */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi, type SignupPayload } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
  const [form, setForm] = useState<SignupPayload>({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (user) => { setUser(user); navigate("/dashboard"); },
    onError: (err: any) => setError(err?.response?.data?.message ?? "Registration failed. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    mutation.mutate(form);
  };

  const field = (
    id: string, label: string, type: string, value: string,
    onChange: (v: string) => void, placeholder: string, autoComplete?: string
  ) => (
    <div>
      <label htmlFor={id} className="font-mono text-[11.5px] text-t3 block mb-[7px]">{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 bg-paper-sunken border border-line rounded-sm px-3 text-[13.5px] text-ink font-body focus:outline-none focus:border-axiom transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="bg-paper rounded-lg overflow-hidden shadow-modal">
          <div className="px-[22px] py-[18px] border-b border-line">
            <h1 className="font-display font-semibold text-[18px] text-ink">Create your account</h1>
          </div>

          <div className="p-[22px]">
            {error && (
              <div className="mb-4 px-3 py-[10px] rounded-sm bg-danger-tint text-danger text-[13px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-[14px]">
              {field("signup-name", "Full name", "text", form.name, (v) => setForm({ ...form, name: v }), "Sana Khan", "name")}
              {field("signup-email", "Email", "email", form.email, (v) => setForm({ ...form, email: v }), "you@example.com", "email")}

              {/* Password with toggle */}
              <div>
                <label htmlFor="signup-password" className="font-mono text-[11.5px] text-t3 block mb-[7px]">Password</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimum 8 characters"
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

              <Button type="submit" variant="primary" size="lg" block disabled={mutation.isPending} id="signup-submit-btn">
                {mutation.isPending ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="text-[12.5px] text-t2 text-center mt-[14px]">
              Already have an account?{" "}
              <Link to="/login" className="text-axiom hover:underline" id="signup-login-link">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
