import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { useAuth } from './features/auth/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import MenuEditorPage from './features/menu-editor/MenuEditorPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import PublicMenuPage from './features/public-menu/PublicMenuPage';
import WelcomePage from './features/welcome/WelcomePage';
import ProfilePage from './features/profile/ProfilePage'; // Import


// Wrapper to redirect logged-in users away from login/register
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu/:id" element={<PublicMenuPage />} />
        
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />


        <Route path="/profile" element={
          <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
        } />
        <Route path="/menus/:id" element={
          <ProtectedRoute><Layout><MenuEditorPage /></Layout></ProtectedRoute>
        } />
        <Route path="/menus/:id/analytics" element={
          <ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}