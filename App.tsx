
import React from 'react';
// FIX: import useLocation to correctly wire up AnimatePresence with React Router.
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AdminPanelPage from './pages/AdminPanelPage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAdmin } = useAuth();
    if (!user || !isAdmin) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

const AnimatedRoutes = () => {
  // FIX: Get location from React Router to make AnimatePresence work correctly.
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* FIX: Pass location and a unique key to Routes for AnimatePresence to detect route changes. */}
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<motion.div key="login" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><LoginPage /></motion.div>} />
        <Route path="/signup" element={<motion.div key="signup" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><SignUpPage /></motion.div>} />
        <Route path="/" element={<ProtectedRoute><motion.div key="home" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><HomePage /></motion.div></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><motion.div key="upload" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><UploadPage /></motion.div></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><motion.div key="quiz" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><QuizPage /></motion.div></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><motion.div key="result" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><ResultPage /></motion.div></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><motion.div key="admin" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><AdminPanelPage /></motion.div></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
