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
import { PaymentPage } from './components/pages/PaymentPage';
import { FeedbackPage } from './components/pages/FeedbackPage';
import { OfficerDashboard } from './components/pages/OfficerDashboard';
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        {/* <Route path="/export" element={<ExportPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}