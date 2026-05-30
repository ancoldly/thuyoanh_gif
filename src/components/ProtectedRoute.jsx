import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredEmail }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="p-8 text-center">Đang kiểm tra quyền truy cập...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (requiredEmail && user.email !== requiredEmail) return <Navigate to="/" replace />;
  return children;
}
