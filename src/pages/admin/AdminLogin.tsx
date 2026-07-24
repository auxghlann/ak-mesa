import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin/projects', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate('/admin/projects', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-margin-mobile md:px-0 py-section-gap">
      <div className="bg-surface-container p-8 rounded-[24px] border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary rounded-[16px] flex items-center justify-center text-on-primary">
            <span className="material-symbols-rounded text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
              Admin Portal
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Sign in to manage portfolio projects
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-body-md font-medium border border-error/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface border border-outline-variant rounded-xl p-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-primary text-on-primary font-label-lg text-label-lg py-3 px-6 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm font-semibold disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-rounded animate-spin text-[20px]">progress_activity</span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
