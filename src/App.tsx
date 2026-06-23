import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GuestRoute } from '@/components/auth/GuestRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ResumePage } from '@/pages/dashboard/ResumePage';
import { ATSPage } from '@/pages/dashboard/ATSPage';
import { CoverLetterPage } from '@/pages/dashboard/CoverLetterPage';
import { PortfolioPage } from '@/pages/dashboard/PortfolioPage';
import { SkillsPage } from '@/pages/dashboard/SkillsPage';
import { JobsPage } from '@/pages/dashboard/JobsPage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { AdminPage } from '@/pages/admin/AdminPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPasswordPage />
                </GuestRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="resume/*" element={<ResumePage />} />
              <Route path="ats" element={<ATSPage />} />
              <Route path="cover-letter" element={<CoverLetterPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
