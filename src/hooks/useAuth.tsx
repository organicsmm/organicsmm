import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, Wallet, AppRole } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  wallet: Wallet | null;
  role: AppRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);

  // ALWAYS start loading as true to avoid redirecting before Supabase fetch completes
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [profileResult, walletResult, roleResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('wallets').select('*').eq('user_id', userId).single(),
        supabase.from('user_roles').select('role').eq('user_id', userId).single(),
      ]);

      if (profileResult.data) setProfile(profileResult.data as Profile);
      if (walletResult.data) setWallet(walletResult.data as Wallet);
      if (roleResult.data) setRole(roleResult.data.role as AppRole);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  // Set up realtime subscription for wallet updates
  useEffect(() => {
    if (!user) return;

    const walletChannel = supabase
      .channel(`wallet-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            setWallet(payload.new as Wallet);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(walletChannel);
    };
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    let initialLoadDone = false;

    // Listener for ONGOING auth changes - does NOT control isLoading
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        // Only fetch user data on ONGOING changes (not initial)
        // Initial load is handled by initializeAuth below
        if (initialLoadDone) {
          if (session?.user) {
            fetchUserData(session.user.id);
          } else {
            setProfile(null);
            setWallet(null);
            setRole(null);
          }
        }
      }
    );

    // INITIAL load - controls isLoading, fetches data ONCE
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          initialLoadDone = true;
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const signIn = async (email: string, password: string) => {
    try {
      // Clear any stale session first (wrapped in try-catch to prevent abort errors)
      try { await supabase.auth.signOut({ scope: 'local' }); } catch (_) { }
      await new Promise(r => setTimeout(r, 100));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        return { error: error as Error };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Clear any stale session first (wrapped in try-catch to prevent abort errors)
      try { await supabase.auth.signOut({ scope: 'local' }); } catch (_) { }
      await new Promise(r => setTimeout(r, 100));

      const redirectUrl = `${window.location.origin}/engagement-order`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error.message);
        return { error: error as Error };
      }

      // If user already exists, Supabase returns data but with identities = []
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: new Error('This email is already registered. Please login instead.') };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setWallet(null);
      setRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if sign out fails
      setProfile(null);
      setWallet(null);
      setRole(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) setProfile(data as Profile);
    }
  };

  const refreshWallet = async () => {
    if (user) {
      const { data } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) setWallet(data as Wallet);
    }
  };

  const value = {
    user,
    session,
    profile,
    wallet,
    role,
    isLoading,
    isAdmin: role === 'admin',
    signIn,
    signUp,
    signOut,
    refreshProfile,
    refreshWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
