import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
// import { ExportPage } from './components/pages/ExportPage';

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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/service-form" element={<ServiceFormPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        
        {/* Officer/Admin Routes (Nested inside layout) */}
        <Route path="/officer" element={<OfficerLayout />}>
          <Route path="overview" element={<OfficerOverview />} />
          <Route path="applications" element={<OfficerApplications />} />
          <Route path="reports" element={<OfficerReports />} />
          <Route path="schedules" element={<OfficerSchedules />} />
          <Route path="settings" element={<OfficerSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}