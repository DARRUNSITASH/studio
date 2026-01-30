import { supabase } from './supabase';
import type { User } from './types';

/**
 * Authentication helper functions for Supabase
 */

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    role?: 'patient' | 'doctor' | 'admin';
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, name: string, role: 'patient' | 'doctor' | 'admin' = 'patient') {
    if (!supabase) {
        throw new Error('Supabase is not configured');
    }

    // Create auth user with metadata
    // The database trigger will automatically create the profile
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
                role: role,
            }
        }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Profile is automatically created by the database trigger
    // No need to manually insert into profiles table

    return authData.user;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    if (!supabase) {
        throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data.user;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    if (!supabase) {
        throw new Error('Supabase is not configured');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current user session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) {
        return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return {
        id: user.id,
        email: user.email!,
        name: profile?.name,
        role: profile?.role,
    };
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: { name?: string; phone?: string; avatar_url?: string }) {
    if (!supabase) {
        throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) throw error;
}

/**
 * Check if Supabase is configured and connected
 */
export async function checkSupabaseConnection(): Promise<boolean> {
    if (!supabase) {
        return false;
    }

    try {
        const { error } = await supabase.from('profiles').select('count').limit(1);
        return !error;
    } catch {
        return false;
    }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!supabase) {
        return () => { };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
        if (session?.user) {
            const authUser = await getCurrentUser();
            callback(authUser);
        } else {
            callback(null);
        }
    });

    return () => {
        subscription.unsubscribe();
    };
}
