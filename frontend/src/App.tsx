import React, { useState, useEffect } from "react";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ShortUrlPage } from "./pages/shortUrl";
import { AnalyticsDetailPage } from "./pages/detailedAnalytics";
import { AnalyticsListPage } from "./pages/analytics";
import { RedirectPage } from "./pages/redirect";
import { ProfilePage } from "./pages/profile";
import { AdminPage } from "./pages/admin";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import { Header } from "./components/header";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { useBackendHealth } from "./hooks/useBackendHealth";
import { BackendOfflinePopup } from "./components/BackendOfflinePopup";

// ---------------- PAGE WRAPPER ----------------
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
};

// ---------------- ROUTES WITH ANIMATION ----------------
const AnimatedRoutes: React.FC = () => {
  const location = useLocation(); // needed for AnimatePresence

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <LoginPage />
            </PageWrapper>
          }
        />
        <Route
          path="/shorten"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <ShortUrlPage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AnalyticsListPage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:shortId"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AnalyticsDetailPage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <ProfilePage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper>
                <AdminPage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/:shortId"
          element={
            <PageWrapper>
              <RedirectPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// ---------------- APP COMPONENT ----------------
const App: React.FC = () => {
  const { isBackendOnline, hasChecked } = useBackendHealth();
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  useEffect(() => {
    // Show popup only once when backend is detected as offline
    if (hasChecked && isBackendOnline === false && !hasSeenPopup) {
      setShowOfflinePopup(true);
    }
  }, [hasChecked, isBackendOnline, hasSeenPopup]);

  const handleDismissPopup = () => {
    setShowOfflinePopup(false);
    setHasSeenPopup(true);
    // Store in sessionStorage so popup doesn't show again during this session
    sessionStorage.setItem("backend_offline_acknowledged", "true");
  };

  return (
    <Router>
      <AuthProvider>
        <Header />
        <AnimatedRoutes />
        <Toaster position="top-center" richColors />

        {/* Backend Offline Popup */}
        {showOfflinePopup && (
          <BackendOfflinePopup onDismiss={handleDismissPopup} />
        )}
      </AuthProvider>
    </Router>
  );
};

export default App;
