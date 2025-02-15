import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Hire from './pages/Hire';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import gsap from './utils/gsap-config';
import ErrorBoundary from './components/ErrorBoundary';
import SignLanguageCoding from './components/SignLanguageCoding';
import Community from './pages/Community';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Initial page load animation
    const content = document.querySelector('main');
    if (!content) return;

    gsap.set(content, { opacity: 0 });
    gsap.to('body', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(content, {
          opacity: 1,
          duration: 0.3
        });
      }
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf([content, 'body']);
    };
  }, [location.pathname]);

  return (
    <AuthProvider>
      <ChatProvider>
        <ErrorBoundary>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/hire" element={<Hire />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/sign-language-coding" element={<SignLanguageCoding />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </MainLayout>
        </ErrorBoundary>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App; 