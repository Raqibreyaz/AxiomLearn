import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Zap, Star, ChevronRight, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience and up-to-date curricula.",
  },
  {
    icon: Zap,
    title: "Learn at Your Pace",
    description: "Access course content anytime, anywhere. Pause, rewind, and revisit at your convenience.",
  },
  {
    icon: Users,
    title: "Vibrant Community",
    description: "Connect with fellow learners and instructors, collaborate, and grow together.",
  },
];

const stats = [
  { value: "10K+", label: "Learners" },
  { value: "250+", label: "Courses" },
  { value: "50+", label: "Instructors" },
  { value: "4.9★", label: "Rating" },
];

const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden px-4">
        {/* Background orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 animate-float"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent)", animationDelay: "2s" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(167,139,250,0.5) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in glass">
            <Sparkles className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
              The Future of Online Learning
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-fade-in leading-tight"
            style={{ animationDelay: "0.1s", color: "var(--color-text)" }}
          >
            Learn Without{" "}
            <span className="gradient-text">Limits.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ color: "var(--color-text-muted)", animationDelay: "0.2s" }}
          >
            Unlock your potential with expert-crafted courses. Gain real skills, earn recognition,
            and accelerate your career — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/courses"
              id="hero-explore-btn"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 glow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary), #5b21b6)" }}
            >
              Explore Courses
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            {!user && (
              <Link
                to="/signup"
                id="hero-signup-btn"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 glass"
                style={{ color: "var(--color-text)" }}
              >
                Join for Free
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((char, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ring-1 ring-purple-500/20"
                  style={{
                    background: `linear-gradient(135deg, hsl(${260 + i * 20}, 70%, 50%), hsl(${280 + i * 20}, 60%, 40%))`,
                    borderColor: "var(--color-bg)",
                    color: "white",
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>4.9</span>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                from 10,000+ learners
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
          <div className="w-0.5 h-8 rounded-full" style={{ background: "var(--color-text-muted)" }} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black mb-1 gradient-text">{stat.value}</p>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text)" }}>
              Why AxiomLearn?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              Everything you need to learn faster, smarter, and more effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass rounded-2xl p-8 animate-fade-in transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "var(--color-primary-light)" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-text)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 gradient-text">
            Ready to Start Learning?
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--color-text-muted)" }}>
            Join thousands of learners already leveling up their skills with AxiomLearn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? "/courses" : "/signup"}
              id="cta-primary-btn"
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 glow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary), #5b21b6)" }}
            >
              {user ? "Browse Courses" : "Start for Free"}
            </Link>
            <Link
              to="/courses"
              id="cta-browse-btn"
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 glass"
              style={{ color: "var(--color-text)" }}
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center"
        style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-dim)" }}
      >
        <p className="text-sm">© {new Date().getFullYear()} AxiomLearn. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
