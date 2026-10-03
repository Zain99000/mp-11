import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        id="auth-card"
        className="liquid-glass rounded-2xl max-w-md w-full p-8 text-white relative shadow-2xl border border-white/10 bg-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <h2
          id="auth-modal-title"
          className="text-3xl text-white mb-2 font-normal tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {mode === 'login' ? 'Welcome Back' : 'Join Asme'}
        </h2>
        <p className="text-white/60 text-xs mb-6">
          {mode === 'login'
            ? 'Access your saved journeys and insights.'
            : 'Start exploring the frontiers of knowledge.'}
        </p>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Check size={24} />
            </div>
            <p className="text-white font-medium text-sm">
              {mode === 'login' ? 'Signed in successfully!' : 'Account created! Welcome.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-white/70 mb-1.5">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-white/70 mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <button
              id="submit-auth-btn"
              type="submit"
              className="w-full mt-2 bg-white hover:bg-white/90 text-black font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="pt-4 text-center text-xs text-white/60">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('signup')}
                    className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
