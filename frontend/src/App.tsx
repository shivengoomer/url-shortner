import React from "react";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShortUrlPage } from "./pages/shortUrl";
import { AnalyticsDetailPage } from "./pages/detailedAnalytics";
import { AnalyticsListPage } from "./pages/analytics";
import { RedirectPage } from "./pages/redirect";
import { ProfilePage } from "./pages/profile";
import { AdminPage } from "./pages/admin";
import { AuthProvider } from "./context/AuthContext";

// ---------------- APP ROUTES ----------------
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shorten" element={<ShortUrlPage />} />
          <Route path="/analytics" element={<AnalyticsListPage />} />
          <Route path="/analytics/:shortId" element={<AnalyticsDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/:shortId" element={<RedirectPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
