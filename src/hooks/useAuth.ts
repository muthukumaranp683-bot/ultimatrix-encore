import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string, rollNo: string, department?: string, yearOfStudy?: number) => {
    const redirectUrl = `${window.location.origin}/dashboard/student`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: 'student',
          roll_no: rollNo,
          department,
          year_of_study: yearOfStudy,
        }
      }
    });

    if (data.user && !error) {
      // Create user record in custom users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          user_id: data.user.id,
          email,
          full_name: fullName,
          role: 'student',
          password_hash: 'managed_by_supabase_auth'
        });

      if (!userError) {
        // Assign student role
        await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'student'
          });

        // Create student record
        await supabase
          .from('students')
          .insert({
            user_id: data.user.id,
            roll_no: rollNo,
            department: department || null,
            year_of_study: yearOfStudy || null,
          });
      }
    }

    return { data, error };
  };

  const getUserRole = async () => {
    if (!authState.session?.user) return null;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authState.session.user.id)
      .maybeSingle();
    
    return data?.role || null;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    getUserRole,
  };
}