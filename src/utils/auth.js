import { jwtDecode } from 'jwt-decode';
import zxcvbn from 'zxcvbn';
import { createClient } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut } from '../config/supabaseClient';

// Token management
export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

// Refresh token management
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);
export const removeRefreshToken = () => localStorage.removeItem('refreshToken');

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Advanced password validation using zxcvbn
export const validatePassword = (password) => {
  const result = zxcvbn(password);
  const minLength = 8;
  
  const errors = [];
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  // Check password strength score (0-4)
  if (result.score < 3) {
    errors.push(...result.feedback.suggestions);
    if (result.feedback.warning) {
      errors.push(result.feedback.warning);
    }
  }

  // Additional security checks
  if (!/[A-Z]/.test(password)) errors.push('Add an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Add a lowercase letter');
  if (!/\d/.test(password)) errors.push('Add a number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Add a special character');

  return {
    isValid: errors.length === 0,
    score: result.score,
    errors,
    feedback: result.feedback,
    strengthText: [
      'Very Weak',
      'Weak',
      'Fair',
      'Strong',
      'Very Strong'
    ][result.score]
  };
};

// Enhanced email validation
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  } else if (email.length > 254) {
    errors.push('Email is too long');
  }

  // Additional checks
  if (email.startsWith('.') || email.endsWith('.')) {
    errors.push('Email cannot start or end with a dot');
  }
  if (email.includes('..')) {
    errors.push('Email cannot contain consecutive dots');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced session management
export const clearAuthSession = () => {
  // Clear all auth-related items
  const authItems = [
    'authToken',
    'refreshToken',
    'user',
    'loginAttempts',
    'theme',
    'language'
  ];
  
  authItems.forEach(item => localStorage.removeItem(item));
  sessionStorage.clear();
  
  // Clear any auth-related cookies
  document.cookie.split(';').forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
};

// Rate limiting for login attempts
const RATE_LIMIT_KEY = 'loginAttempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const checkLoginAttempts = () => {
  try {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count": 0}');
    if (attempts.timestamp && Date.now() - attempts.timestamp < LOCKOUT_TIME && attempts.count >= MAX_ATTEMPTS) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (Date.now() - attempts.timestamp)) / 1000 / 60);
      return {
        allowed: false,
        message: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
        remainingTime
      };
    }
    return { allowed: true };
  } catch (error) {
    console.error('Error checking login attempts:', error);
    localStorage.removeItem(RATE_LIMIT_KEY);
    return { allowed: true };
  }
};

export const recordLoginAttempt = (success = false) => {
  try {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count": 0}');
    if (success) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return;
    }
    
    const now = Date.now();
    if (!attempts.timestamp || now - attempts.timestamp >= LOCKOUT_TIME) {
      attempts.count = 1;
      attempts.timestamp = now;
    } else {
      attempts.count += 1;
    }
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
  } catch (error) {
    console.error('Error recording login attempt:', error);
    localStorage.removeItem(RATE_LIMIT_KEY);
  }
};

// Token refresh scheduling
let refreshTimeout;

export const scheduleTokenRefresh = (token) => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  
  try {
    const decoded = jwtDecode(token);
    const expiresIn = decoded.exp * 1000 - Date.now();
    const refreshTime = Math.max(0, expiresIn - (60 * 1000)); // Refresh 1 minute before expiry
    
    refreshTimeout = setTimeout(() => {
      // Dispatch refresh token event
      window.dispatchEvent(new CustomEvent('token-refresh-needed'));
    }, refreshTime);
  } catch (error) {
    console.error('Error scheduling token refresh:', error);
  }
};

// Clean up on unmount
export const cleanup = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
};

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced gesture preferences with Supabase
export const saveGesturePreferences = async (userId, preferences) => {
  try {
    // First, check if preferences exist
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: userId,
        gesture_preferences: preferences,
        updated_at: new Date().toISOString(),
        created_at: existing?.created_at || new Date().toISOString()
      });
      
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};

export const loadGesturePreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('gesture_preferences, updated_at')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // Not found error
      console.error('Supabase error:', error);
      throw error;
    }
    
    return {
      preferences: data?.gesture_preferences || {},
      lastUpdated: data?.updated_at
    };
  } catch (error) {
    console.error('Error loading preferences:', error);
    return {
      preferences: {},
      lastUpdated: null
    };
  }
};

// Add gesture training data management
export const saveGestureTrainingData = async (userId, gestureData) => {
  try {
    const { data, error } = await supabase
      .from('gesture_training_data')
      .insert({
        user_id: userId,
        gesture_name: gestureData.name,
        training_data: gestureData.data,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving training data:', error);
    throw error;
  }
};

export const getGestureTrainingData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('gesture_training_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading training data:', error);
    return [];
  }
};

// Add user settings management
export const saveUserSettings = async (userId, settings) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

export const getUserSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.settings || {};
  } catch (error) {
    console.error('Error loading user settings:', error);
    return {};
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: (await getCurrentUser())?.id,
        ...updates,
        updated_at: new Date()
      });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export { signIn, signUp, signOut };
