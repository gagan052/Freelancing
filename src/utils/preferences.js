import { supabase } from '../config/supabaseClient';

export const saveUserPreferences = async (preferences) => {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      preferences,
      user_id: supabase.auth.user()?.id,
      updated_at: new Date(),
    });
  
  if (error) throw error;
  return data;
};

export const getUserPreferences = async () => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('preferences')
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data?.preferences || {};
}; 