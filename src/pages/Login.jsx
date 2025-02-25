import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card3D } from '../components/animations/Card3D';
import { useAuth } from '../contexts/AuthContext';
import { signIn } from '../config/supabaseClient';

function Login() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: '',
    company: '',
    phone: '',
    agreeToTerms: false,
    newsletter: false,
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const cardRef = useRef(null);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldFocus, setFieldFocus] = useState(null);

  const roleOptions = [
    { value: 'developer', label: 'Developer', icon: '👨‍💻' },
    { value: 'designer', label: 'Designer', icon: '🎨' },
    { value: 'manager', label: 'Manager', icon: '👔' },
    { value: 'other', label: 'Other', icon: '💼' }
  ];

  const socialProviders = [
    { name: 'Google', icon: '🔍', bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20' },
    { name: 'GitHub', icon: '🐱', bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-900/20' },
    { name: 'LinkedIn', icon: '💼', bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20' }
  ];

  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      const { data, error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      setLoginSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setErrors({ email: error.message });
    }
  };

  const [error, setLoginError] = useState(null);

  if (error) {
    return <div>Login Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Card3D>
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-200">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formType === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {formType === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setFormType('register')}
                    className="text-purple-600 hover:text-purple-500 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setFormType('login')}
                    className="text-purple-600 hover:text-purple-500 font-medium transition-colors"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {errors.email && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {errors.email}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {formType === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 rounded border-gray-300"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-purple-600 hover:text-purple-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                formType === 'login' ? 'Sign in' : 'Create account'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {socialProviders.map((provider) => (
                <button
                  key={provider.name}
                  className={`relative flex justify-center py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 ${provider.bgColor}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-300" />
                  <span className="relative">{provider.icon}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </Card3D>

      {loginSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center slide-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Login Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login; 