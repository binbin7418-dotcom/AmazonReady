import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  deductCredit: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile();
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user || null });
        if (session?.user) {
          await get().fetchProfile();
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ initialized: true, loading: false });
    }
  },

  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        set({ user: data.user });
        // Trigger 会自动创建 profile，稍等后拉取
        setTimeout(() => get().fetchProfile(), 1000);
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      set({ user: data.user });
      await get().fetchProfile();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      set({ profile: data });
    }
  },

  deductCredit: async () => {
    const { user, profile } = get();
    if (!user || !profile) return false;
    if (profile.credits_balance < 1) return false;

    // Enterprise 用户不扣减余额
    if (profile.credits_balance === 999999) {
      await supabase
        .from('user_profiles')
        .update({ credits_used: profile.credits_used + 1 })
        .eq('id', user.id);
      await get().fetchProfile();
      return true;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        credits_balance: profile.credits_balance - 1,
        credits_used: profile.credits_used + 1,
      })
      .eq('id', user.id)
      .gte('credits_balance', 1); // 防止并发超扣

    if (error) return false;
    await get().fetchProfile();
    return true;
  },
}));
