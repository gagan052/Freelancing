import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold" aria-label="Home">
            EnableFreelance
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Menu</span>
              {/* Hamburger icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className={`md:flex items-center gap-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
              <Link to="/jobs" className="block px-4 py-2 hover:text-purple-600 dark:hover:text-purple-400" aria-label="Find Jobs">
                Find Jobs
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="block px-4 py-2 hover:text-purple-600 dark:hover:text-purple-400">
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block px-4 py-2 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Login
                </Link>
              )}
              <Link
                to="/hire"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500"
                aria-label="Post a Job"
              >
                Post a Job
              </Link>
              <Link 
                to="/sign-language-coding" 
                className="block px-4 py-2 hover:text-purple-600 dark:hover:text-purple-400"
              >
                Sign Language Coding
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 