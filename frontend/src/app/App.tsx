import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickSearch } from './components/QuickSearch';
import { PopularServices } from './components/PopularServices';
import { ServiceCategories } from './components/ServiceCategories';
import { News } from './components/News';
import { Footer } from './components/Footer';
import { ChatbotButton } from './components/ChatbotButton';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ServiceFormPage } from './components/pages/ServiceFormPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { TrackingPage } from './components/pages/TrackingPage';
import { PaymentPage } from './components/pages/PaymentPage';
import { FeedbackPage } from './components/pages/FeedbackPage';
import { OfficerLayout } from './components/pages/OfficerLayout';
import { OfficerOverview } from './components/pages/OfficerOverview';
import { OfficerApplications } from './components/pages/OfficerApplications';
import { OfficerReports } from './components/pages/OfficerReports';
import { OfficerSettings } from './components/pages/OfficerSettings';
import { OfficerSchedules } from './components/pages/OfficerSchedules';
import { OfficerPostsPage } from './components/pages/OfficerPostsPage';
import { OfficerServicesPage } from './components/pages/OfficerServicesPage';
import { OfficerReviews } from './components/pages/OfficerReviews';
import { VerifyEmailPage } from './components/pages/VerifyEmailPage';
import { OfficerFeedbacks } from './components/pages/OfficerFeedbacks';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <QuickSearch />
      <PopularServices />
      <ServiceCategories />
      <News />
      <Footer />
      <ChatbotButton />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function OfficerRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || (user.role !== 'officer' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isOfficerPage = location.pathname.startsWith('/officer');
  return (
    <>
      {!isOfficerPage && <Header />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/service-form" element={<ProtectedRoute><ServiceFormPage /></ProtectedRoute>} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* Officer/Admin Routes (Nested inside layout) */}
          <Route path="/officer" element={<OfficerRoute><OfficerLayout /></OfficerRoute>}>
            <Route path="overview" element={<OfficerOverview />} />
            <Route path="applications" element={<OfficerApplications />} />
            <Route path="posts" element={<OfficerPostsPage />} />
            <Route path="services" element={<OfficerServicesPage />} />
            <Route path="reviews" element={<OfficerReviews />} />
            <Route path="feedbacks" element={<OfficerFeedbacks />} />
            <Route path="reports" element={<OfficerReports />} />
            <Route path="schedules" element={<OfficerSchedules />} />
            <Route path="settings" element={<OfficerSettings />} />
          </Route>

          {/* Catch-all: 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}