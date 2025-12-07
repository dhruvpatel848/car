import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LocationModal from './components/LocationModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-darker">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <LocationModal />}
      {!isAdminRoute && <FloatingWhatsApp />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

import { CarSelectionProvider } from './context/CarSelectionContext';
import CarSelectionModal from './components/CarSelectionModal';

function App() {
  return (
    <LocationProvider>
      <CarSelectionProvider>
        <Router>
          <AppContent />
          <CarSelectionModal />
        </Router>
      </CarSelectionProvider>
    </LocationProvider>
  );
}

export default App;
