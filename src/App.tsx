import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useStore } from './store/useStore';

// Public Pages
import Home from './pages/public/Home';
import News from './pages/public/News';
import Gallery from './pages/public/Gallery';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Donate from './pages/public/Donate';
import Faq from './pages/public/Faq';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

import NewsManager from './pages/admin/NewsManager';
import GalleryManager from './pages/admin/GalleryManager';
import ActivityManager from './pages/admin/ActivityManager';
import DonationInfoManager from './pages/admin/DonationInfoManager';
import ContactInfoManager from './pages/admin/ContactInfoManager';
import Messages from './pages/admin/Messages';
import AbbotsManager from './pages/admin/AbbotsManager';
import DonationsManager from './pages/admin/DonationsManager';
import PopupsManager from './pages/admin/PopupsManager';
import AnnouncementsManager from './pages/admin/AnnouncementsManager';
import ServerStatusManager from './pages/admin/ServerStatusManager';
import MenusManager from './pages/admin/MenusManager';
import UsersManager from './pages/admin/UsersManager';
import RolesManager from './pages/admin/RolesManager';
import SettingsManager from './pages/admin/SettingsManager';
import ActivityLog from './pages/admin/ActivityLog';
import Backup from './pages/admin/Backup';
import Analytics from './pages/admin/Analytics';
import RecycleBin from './pages/admin/RecycleBin';

// Placeholder components for public routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <h2 className="text-2xl font-serif text-[#8B7355]">{title} (รอการพัฒนา)</h2>
  </div>
);

// Admin Placeholder
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-gray-100 luxury-shadow p-12 text-center">
    <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-4 border border-[#8B7355]/20">
      <span className="text-[#C5A059] font-bold">...</span>
    </div>
    <h2 className="text-2xl font-serif text-[#1B3022] mb-2">{title}</h2>
    <p className="text-[#2C2C2C] opacity-70 max-w-md">
      ระบบนี้กำลังอยู่ในระหว่างการพัฒนา (Work in Progress) จะพร้อมใช้งานในเร็วๆ นี้
    </p>
  </div>
);

export default function App() {
  const initSupabaseSync = useStore(state => state.initSupabaseSync);

  useEffect(() => {
    initSupabaseSync();
  }, [initSupabaseSync]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirects for Vercel/general compatibility */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<Donate />} />
          <Route path="faq" element={<Faq />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="activities" element={<ActivityManager />} />
            <Route path="donation-info" element={<DonationInfoManager />} />
            <Route path="contact-info" element={<ContactInfoManager />} />
            <Route path="messages" element={<Messages />} />
            <Route path="abbots" element={<AbbotsManager />} />
            <Route path="donations" element={<DonationsManager />} />
            <Route path="popups" element={<PopupsManager />} />
            <Route path="announcements" element={<AnnouncementsManager />} />
            <Route path="server-status" element={<ServerStatusManager />} />
            <Route path="menus" element={<MenusManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="roles" element={<RolesManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="activity-log" element={<ActivityLog />} />
            <Route path="backup" element={<Backup />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="recycle-bin" element={<RecycleBin />} />
          </Route>
        </Route>

        {/* Catch-all route for 404s */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
