// Main App Component for Bellavista Care Homes
// Clean routing structure with lazy loading for performance

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './styles/global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import ChatWidget from './components/ChatWidget';
import CookieBanner from './components/CookieBanner';
import ProtectedRoute from './components/ProtectedRoute';
import SmoothScroll from './components/SmoothScroll';
import SessionExpiredModal from './components/SessionExpiredModal';
import DesktopExperienceNotice from './components/DesktopExperienceNotice';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// =============================================================================
// LAZY LOADED COMPONENTS FOR PERFORMANCE
// =============================================================================

// Main Pages
const Home = lazy(() => import('./pages/MainPage'));
const ComingSoon = lazy(() => import('./components/ComingSoon'));

// New Pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const Enquiry = lazy(() => import('./pages/Enquiry'));

// Booking Pages
const ScheduleTour = lazy(() => import('./pages/ScheduleTour'));

// Care Home Locations
const OurHomesPage = lazy(() => import('./pages/OurHomes'));
const Barry = lazy(() => import('./locations/BellavistaBarry'));
const Cardiff = lazy(() => import('./locations/BellavistaCardiff'));
const CollegeFields = lazy(() => import('./locations/CollegeFieldsNursingHome'));
const Waverley = lazy(() => import('./locations/WaverleyCareCentre'));
const Baltimore = lazy(() => import('./locations/BellavistaBaltimore'));
const MeadowVale = lazy(() => import('./locations/MeadowValeCwtch'));

// Additional Pages
const Activities = lazy(() => import('./pages/Activities'));
const Care = lazy(() => import('./pages/Care'));
const Events = lazy(() => import('./pages/Events'));
const Facilities = lazy(() => import('./pages/Facilities'));
const News = lazy(() => import('./pages/OurNews'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Career = lazy(() => import('./pages/Careers'));
const Gallery = lazy(() => import('./pages/Gallery'));

// SEO Content Pages
const BellavistaNursingHome = lazy(() => import('./pages/BellavistaNursingHome'));
const DiningNutrition = lazy(() => import('./pages/DiningNutrition'));
const OurVision = lazy(() => import('./pages/OurVision'));
const OurValues = lazy(() => import('./pages/OurValues'));
const CareHomesCardiff = lazy(() => import('./pages/CareHomesCardiff'));
const DementiaCareGuide = lazy(() => import('./pages/DementiaCareGuide'));
const OurCare = lazy(() => import('./pages/Services')); // Redirect to Services
const ManagementTeam = lazy(() => import('./pages/ManagementTeam'));
const CurrentJobs = lazy(() => import('./pages/Careers')); // Redirect to Careers
const TrainingDevelopment = lazy(() => import('./pages/TrainingDevelopment'));
const StaffPortal = lazy(() => import('./pages/StaffPortal'));
const VisitorPolicy = lazy(() => import('./pages/VisitorPolicy'));
const DementiaEnvironment = lazy(() => import('./pages/DementiaEnvironment'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Admin Pages
const AdminConsole = lazy(() => import('./admin/AdminConsole'));
const ReceptionKiosk = lazy(() => import('./pages/ReceptionKiosk'));
const Login = lazy(() => import('./pages/Login'));

// =============================================================================
// LOADING AND ERROR COMPONENTS
// =============================================================================

const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px'
  }}>
    <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
    Loading...
  </div>
);

const NotFound = () => (
  <div style={{ padding: '100px 20px', textAlign: 'center', background: 'var(--bg-light)' }}>
    <div className="container">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#0066cc' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}>The page you're looking for doesn't exist.</p>
      <a href="#/" className="btn" style={{ background: '#0066cc', color: 'white', padding: '12px 30px', borderRadius: '25px', textDecoration: 'none' }}>
        Return Home
      </a>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Global fetch interceptor for 401 handling
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        // Check if we are already on the login page to avoid loop
        if (!window.location.pathname.includes('/login')) {
          setIsSessionExpired(true);
        }
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleSessionExpiredClose = () => {
    setIsSessionExpired(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-console';
  const isKioskRoute = location.pathname.startsWith('/kiosk');

  // Define routes where ChatWidget should appear (Home page and all Location pages)
  const showChatWidget = [
    '/',
    '/our-homes',
    '/bellavista-barry',
    '/bellavista-cardiff',
    '/waverley-care-center',
    '/college-fields-nursing-home',
    '/baltimore-care-home',
    '/meadow-vale-cwtch',
    '/bellavista-pontypridd'
  ].includes(location.pathname);

  if (isAdminRoute || isKioskRoute) {
    return (
      <div className="App">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </Helmet>
        <SessionExpiredModal isOpen={isSessionExpired} onClose={handleSessionExpiredClose} />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminConsole />
              </ProtectedRoute>
            } />
            <Route path="/admin-console" element={
              <ProtectedRoute>
                <AdminConsole />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kiosk/:locationId" element={
              <ProtectedRoute>
                <ReceptionKiosk />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="App">
      <SessionExpiredModal isOpen={isSessionExpired} onClose={handleSessionExpiredClose} />
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            
            {/* Booking & Enquiry */}
            <Route path="/schedule-tour" element={<ScheduleTour />} />
            <Route path="/enquiry" element={<Enquiry />} />
            
            {/* Care Homes */}
            <Route path="/our-homes" element={<OurHomesPage isStandalone={true} />} />
            <Route path="/bellavista-barry" element={<Barry />} />
            <Route path="/bellavista-cardiff" element={<Cardiff />} />
            <Route path="/waverley-care-center" element={<Waverley />} />
            <Route path="/college-fields-nursing-home" element={<CollegeFields />} />
            <Route path="/baltimore-care-home" element={<Baltimore />} />
            <Route path="/meadow-vale-cwtch" element={<MeadowVale />} />
            <Route path="/bellavista-pontypridd" element={<ComingSoon />} />
            
            {/* Additional Pages */}
            {/* <Route path="/activities" element={<Activities />} /> Global activities page removed */}
            <Route path="/activities/:locationId" element={<Activities />} />
            <Route path="/care/:locationId" element={<Care />} />
            <Route path="/events" element={<Events />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/facilities/:locationId" element={<Facilities />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/career" element={<Career />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/dining-and-nutrition" element={<DiningNutrition />} />
            <Route path="/our-vision" element={<OurVision />} />
            <Route path="/our-values" element={<OurValues />} />
            <Route path="/our-care" element={<OurCare />} />
            <Route path="/management-team" element={<ManagementTeam />} />
            <Route path="/current-jobs" element={<CurrentJobs />} />
            <Route path="/training-and-development" element={<TrainingDevelopment />} />
            <Route path="/staff-portal" element={<StaffPortal />} />
            <Route path="/visitor-policy" element={<VisitorPolicy />} />
            <Route path="/dementia-friendly-environment" element={<DementiaEnvironment />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* SEO Content Pages */}
            <Route path="/bellavista-nursing-home" element={<BellavistaNursingHome />} />
            <Route path="/care-homes-cardiff" element={<CareHomesCardiff />} />
            <Route path="/dementia-care-guide" element={<DementiaCareGuide />} />
            
            {/* Admin & Auth Pages */}
            <Route path="/login" element={<Login />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
      {showChatWidget && <ChatWidget />}
      <CookieBanner />
      <DesktopExperienceNotice />
    </div>
  );
};

function App() {
  return (
    <Router>
      <SmoothScroll>
        <ScrollToTop />
        <AppContent />
      </SmoothScroll>
    </Router>
  );
}

export default App;
