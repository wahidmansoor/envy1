import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabaseClient } from '../../lib/supabase';
import { toast } from 'sonner';

interface AuthState {
  isLogin: boolean;
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isLogin: true,
    email: '',
    password: '',
    loading: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (state.isLogin) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: state.email,
          password: state.password,
        });

        if (error) throw error;
        toast.success('Successfully signed in');
        navigate('/dashboard/handbook');
      } else {
        const { error } = await supabaseClient.auth.signUp({
          email: state.email,
          password: state.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        toast.success('Registration successful! Please check your email.');
        setState(prev => ({ ...prev, isLogin: true }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
      toast.error(state.isLogin ? 'Failed to sign in' : 'Failed to sign up');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
      toast.error('Failed to sign in with Google');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {state.isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>

        {state.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md 
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={state.password}
                onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={state.loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:bg-indigo-400"
            >
              {state.loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : state.isLogin ? (
                'Sign in'
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to home
            </button>
            <button
              type="button"
              onClick={() => setState(prev => ({ ...prev, isLogin: !prev.isLogin }))}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {state.isLogin ? 'Create account' : 'Sign in instead'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={state.loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 
              rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </form>
      </div>
    </div>
  );
}