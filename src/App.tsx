import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

// Public Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Success from './pages/Success';
import VerifyMember from './pages/VerifyMember';

// Admin Pages
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminMemberDetails from './pages/admin/MemberDetails';
import AdminIDCards from './pages/admin/IDCards';
import AdminSettings from './pages/admin/Settings';
import AdminAddMember from './pages/admin/AddMember';
import AdminAuditLogs from './pages/admin/AuditLogs';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />
            <Route path="/member/:membershipId" element={<VerifyMember />} />
          </Route>

          {/* Admin Login (Standalone) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes with Sidebar Layout */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-member" element={<AdminAddMember />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="members/:id" element={<AdminMemberDetails />} />
            <Route path="id-cards" element={<AdminIDCards />} />
            <Route path="logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;

