import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card3D } from '../components/animations/Card3D';

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
  const backgroundControls = useAnimation();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const floatingElements = [
    { icon: '💼', delay: 0 },
    { icon: '💻', delay: 0.2 },
    { icon: '🎯', delay: 0.4 },
    { icon: '📈', delay: 0.6 },
  ];

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldFocus, setFieldFocus] = useState(null);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const roleOptions = [
    { value: 'developer', label: 'Developer', icon: '👨‍💻' },
    { value: 'designer', label: 'Designer', icon: '🎨' },
    { value: 'manager', label: 'Manager', icon: '👔' },
    { value: 'other', label: 'Other', icon: '💼' }
  ];

  useEffect(() => {
    backgroundControls.start({
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }
    });
  }, []);

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5
  }));

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Additional validations for registration
    if (formType === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoginSuccess(true);
      
      // Simulate redirect after successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const socialProviders = [
    {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
          />
        </svg>
      ),
      bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20'
    },
    {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      ),
      bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-700'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          />
        </svg>
      ),
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    }
  ];

  // Gradient follow cursor effect
  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPosition({ x, y });
    }
  };

  // Interactive background patterns
  const patterns = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
  }));

  // Animated emojis for successful input
  const successEmojis = ['✨', '🎉', '🌟', '💫', '🎯'];
  const [showSuccessEmoji, setShowSuccessEmoji] = useState(false);

  // Enhanced validation feedback
  const handleInputValidation = (field) => {
    if (formData[field] && !errors[field]) {
      setShowSuccessEmoji(true);
      setTimeout(() => setShowSuccessEmoji(false), 1000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 to-white 
      dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      style={{
        backgroundImage: 'radial-gradient(circle at var(--x) var(--y), rgba(147, 51, 234, 0.15) 0%, transparent 60%)',
        '--x': `${cursorPosition.x}px`,
        '--y': `${cursorPosition.y}px`
      }}
    >
      {/* Animated Background Patterns */}
      {patterns.map((pattern) => (
        <motion.div
          key={pattern.id}
          className="absolute w-2 h-2 bg-purple-500/10 rounded-full"
          initial={{ 
            x: `${pattern.initialX}vw`, 
            y: `${pattern.initialY}vh`,
            scale: 0
          }}
          animate={{
            x: [
              `${pattern.initialX}vw`,
              `${pattern.initialX + (Math.random() * 10 - 5)}vw`
            ],
            y: [
              `${pattern.initialY}vh`,
              `${pattern.initialY + (Math.random() * 10 - 5)}vh`
            ],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Interactive Card */}
      <Card3D>
        <motion.div
          ref={cardRef}
          className="relative w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
            rounded-2xl shadow-xl overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={() => setIsHoveringCard(false)}
          whileHover={{ scale: 1.02 }}
          animate={{
            boxShadow: isHoveringCard 
              ? "0 20px 40px rgba(147, 51, 234, 0.3)" 
              : "0 10px 30px rgba(0, 0, 0, 0.1)"
          }}
        >
          {/* Animated Gradient Border */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(${cursorPosition.x}deg, rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.5))`,
              filter: 'blur(20px)',
              opacity: isHoveringCard ? 0.5 : 0
            }}
          />

          {/* Enhanced Header with 3D Effect */}
          <motion.div
            className="relative h-40 bg-gradient-to-br from-purple-600 to-blue-600 p-6 overflow-hidden"
            style={{
              transform: isHoveringCard 
                ? `perspective(1000px) rotateX(${(cursorPosition.y - 200) / 20}deg) 
                   rotateY(${(cursorPosition.x - 200) / 20}deg)`
                : 'none',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Animated Particles in Header */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{
                  x: [0, Math.random() * 400 - 200],
                  y: [0, Math.random() * 200 - 100],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}

            <motion.h1
              className="relative text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {formType === 'login' ? 'Welcome Back!' : 'Create Account'}
            </motion.h1>
            
            <motion.p
              className="relative text-purple-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {formType === 'login' 
                ? 'Sign in to access your account' 
                : 'Join our community of professionals'}
            </motion.p>
          </motion.div>

          {/* Form Content with Enhanced Interactions */}
          <div className="relative p-8 z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 
                      dark:bg-gray-700 cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                  >
                    {formData.profileImage ? (
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <motion.div
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                        flex items-center justify-center"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-white text-sm">Change Photo</span>
                    </motion.div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Name Field with Animation */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                animate={{ 
                  y: fieldFocus === 'name' ? -5 : 0,
                  scale: fieldFocus === 'name' ? 1.02 : 1
                }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFieldFocus('name')}
                  onBlur={() => setFieldFocus(null)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 
                    focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </motion.div>

              {/* Role Selection with Icons */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((role) => (
                    <motion.button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`flex items-center gap-2 p-3 rounded-lg border 
                        ${formData.role === role.value 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-700'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl">{role.icon}</span>
                      <span className="text-sm">{role.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Password Field with Strength Indicator */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={(e) => {
                      handleInputChange(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                      bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 
                      focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  {/* Password Strength Indicator */}
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-700"
                        animate={{
                          backgroundColor: i < passwordStrength 
                            ? [
                                'rgb(147, 51, 234)', // Purple
                                'rgb(59, 130, 246)', // Blue
                                'rgb(147, 51, 234)' // Purple
                              ]
                            : undefined
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Terms and Newsletter Checkboxes */}
              <div className="space-y-3">
                <motion.label
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 
                      focus:ring-purple-500 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the <Link to="/terms" className="text-purple-600 hover:underline">Terms</Link> and{' '}
                    <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
                  </span>
                </motion.label>

                <motion.label
                  className="flex items-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 
                      focus:ring-purple-500 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Subscribe to our newsletter for updates and opportunities
                  </span>
                </motion.label>
              </div>

              {/* Interactive Submit Button */}
              <motion.button
                type="submit"
                className="relative w-full py-3 rounded-lg overflow-hidden
                  bg-gradient-to-r from-purple-600 to-blue-600 text-white
                  shadow-lg shadow-purple-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0, x: '-100%' }}
                  whileHover={{ scale: 2, x: '100%' }}
                  transition={{ duration: 0.5 }}
                  style={{ opacity: 0.2 }}
                />
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Loading...</span>
                    </motion.div>
                  ) : (
                    'Sign In'
                  )}
                </motion.span>
              </motion.button>
            </form>

            {/* Enhanced Social Login Section */}
            <motion.div
              className="mt-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <motion.div
                    className="w-full border-t border-gray-200 dark:border-gray-700"
                    animate={{
                      scale: [1, 1.02, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Update social provider buttons */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {socialProviders.map((provider) => (
                  <motion.button
                    key={provider.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex justify-center py-2 px-4 border 
                      border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden 
                      ${provider.bgColor}`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent 
                        via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative">{provider.icon}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Card3D>

      {/* Success Modal */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* ... success content ... */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login; 