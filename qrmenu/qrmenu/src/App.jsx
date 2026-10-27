import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import MenuEditorPage from './features/menu-editor/MenuEditorPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import PublicMenuPage from './features/public-menu/PublicMenuPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/menu/:id" element={<PublicMenuPage />} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
        } />
        <Route path="/menus/:id" element={
          <ProtectedRoute><Layout><MenuEditorPage /></Layout></ProtectedRoute>
        } />
        <Route path="/menus/:id/analytics" element={
          <ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}