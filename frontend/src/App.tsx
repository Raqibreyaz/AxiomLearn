import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Pages
import LandingPage      from "./pages/LandingPage";
import CoursesPage      from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage        from "./pages/LoginPage";
import SignupPage       from "./pages/SignupPage";
import DashboardPage    from "./pages/DashboardPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage   from "./pages/EditCoursePage";
import AdminPage        from "./pages/AdminPage";
import SettingsPage     from "./pages/SettingsPage";

/* Inner component so useAuth() runs inside QueryClientProvider */
const AppRoutes = () => {
  const { isLoading, isInitialized } = useAuth();

  if (!isInitialized && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-bone">
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/"                  element={<LandingPage />} />
        <Route path="/courses"           element={<CoursesPage />} />
        <Route path="/courses/:id"       element={<CourseDetailPage />} />

        {/* Auth — redirect if already logged in */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Student — private */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/dashboard/courses" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/dashboard/certificates" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/dashboard/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />

        {/* Instructor/Admin — course management */}
        <Route path="/instructor/create-course" element={
          <RoleRoute roles={["instructor", "admin", "owner"]}>
            <CreateCoursePage />
          </RoleRoute>
        } />
        <Route path="/instructor/courses/:id/edit" element={
          <RoleRoute roles={["instructor", "admin", "owner"]}>
            <EditCoursePage />
          </RoleRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <RoleRoute roles={["admin", "owner"]}>
            <AdminPage />
          </RoleRoute>
        } />
        <Route path="/admin/courses" element={
          <RoleRoute roles={["admin", "owner"]}>
            <AdminPage />
          </RoleRoute>
        } />
        <Route path="/admin/students" element={
          <RoleRoute roles={["admin", "owner"]}>
            <AdminPage />
          </RoleRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
