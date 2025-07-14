
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ServiceCategoriesPage from './components/ServiceCategoriesPage';
import SearchPage from './pages/SearchPage';
import TestPage from './components/TestPage';
import MinimalTest from './components/MinimalTest';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<ServiceCategoriesPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/minimal" element={<MinimalTest />} />
              <Route path="/categories" element={<ServiceCategoriesPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/provider/:id" element={<div className="min-h-screen bg-warm-cream flex items-center justify-center"><p className="text-2xl text-text-secondary">Provider Details Page (Coming Soon)</p></div>} />
              {/* Fallback routes for footer links */}
              <Route path="/services" element={<Navigate to="/categories" replace />} />
              <Route path="/business" element={<div className="min-h-screen bg-warm-cream flex items-center justify-center"><p className="text-2xl text-text-secondary">Business Page (Coming Soon)</p></div>} />
              <Route path="/explore" element={<Navigate to="/categories" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;