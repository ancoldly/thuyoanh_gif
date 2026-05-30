import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import LoginPage from './pages/LoginPage';
import GuestListPage from './pages/GuestListPage';
import ProtectedRoute from './components/ProtectedRoute';

const OWNER_EMAIL = 'thuyoanh204@gmail.com';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route
            path="/danh-sach"
            element={
              <ProtectedRoute requiredEmail={OWNER_EMAIL}>
                <GuestListPage />
              </ProtectedRoute>
            }
          />
          <Route path="/album/manage" element={<Navigate to="/album" replace />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
