import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Please check your .env file for Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
const testConnection = async () => {
  try {
    const { error } = await supabase.from('community_messages').select('count');
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
};

testConnection();

export default supabase;

// Auth helpers
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helpers
export const createGestureRecord = async (gestureData) => {
  const { data, error } = await supabase
    .from('gestures')
    .insert([
      {
        name: gestureData.name,
        command: gestureData.command,
        user_id: supabase.auth.user()?.id,
        created_at: new Date(),
      },
    ]);
  if (error) throw error;
  return data;
};

export const getGestureHistory = async () => {
  const { data, error } = await supabase
    .from('gestures')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};