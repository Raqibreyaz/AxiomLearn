import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAuth } from "./hooks/useAuth";

// Pages
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage from "./pages/EditCoursePage";

const AppRoutes = () => {
  const { isLoading, isInitialized } = useAuth();

  // Show global spinner until auth state is resolved on first load
  if (!isInitialized && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Guest only (redirect to dashboard if already logged in) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Private */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor/Admin only */}
          <Route
            path="/instructor/create-course"
            element={
              <RoleRoute roles={["instructor", "admin", "owner"]}>
                <CreateCoursePage />
              </RoleRoute>
            }
          />
          <Route
            path="/instructor/courses/:id/edit"
            element={
              <RoleRoute roles={["instructor", "admin", "owner"]}>
                <EditCoursePage />
              </RoleRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
