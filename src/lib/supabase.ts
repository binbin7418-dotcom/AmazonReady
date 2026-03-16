import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
          credits_balance: number;
          credits_used: number;
          created_at: string;
        };
      };
      processed_images: {
        Row: {
          id: string;
          user_id: string;
          original_filename: string;
          processed_url: string | null;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          compliance_check: any;
          created_at: string;
        };
      };
    };
  };
};
