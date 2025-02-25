import { Toaster } from 'react-hot-toast';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useDarkMode } from '../../context/DarkModeContext';
import { useEffect } from 'react';

function MainLayout({ children }) {
  const { isDarkMode } = useDarkMode();

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-20">
        {children}
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-800 !text-gray-800 dark:!text-white',
          duration: 3000,
        }}
      />
    </div>
  );
}

export default MainLayout; 