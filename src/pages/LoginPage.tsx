import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Mail } from 'lucide-react';
import { authApi } from '@/services/api';
import GoogleLoginButton from '@/components/layout/GoogleLoginButton';

export const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState('');
  const [isShaking, setIsShaking]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      triggerShake();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      triggerShake();
      return;
    }

    if (!password.trim()) {
      setError('Please enter the admin password.');
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      await authApi.login(email.trim(), password);
      localStorage.setItem('fuskit_auth', 'true');
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Access denied.';
      setError(msg);
      setIsLoading(false);
      triggerShake();
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-pattern">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="login-bg-orb"
            style={{
              width:             `${120 + i * 80}px`,
              height:            `${120 + i * 80}px`,
              left:              `${10 + i * 15}%`,
              top:               `${15 + (i % 3) * 25}%`,
              animationDelay:    `${i * 0.8}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className={`login-card ${mounted ? 'login-card--visible' : ''} ${isShaking ? 'login-card--shake' : ''}`}>
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#D4722A" />
                <path d="M10 14h20M10 20h14M10 26h18" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="30" cy="26" r="4" fill="#2C1A0E" />
              </svg>
            </div>
          </div>
          <h1 className="login-title">
            FUSK <span className="login-title-accent">IT</span>
          </h1>
          <p className="login-subtitle">Super Admin Control Panel</p>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <div className="login-divider-line" />
          <ShieldCheck size={16} className="login-divider-icon" />
          <div className="login-divider-line" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email field */}
          <div className="login-field">
            <label className="login-label" htmlFor="admin-email">
              Email address
            </label>
            <div className="login-input-wrap">
              <Mail size={16} className="login-input-icon" />
              <input
                id="admin-email"
                type="email"
                className="login-input"
                placeholder="admin@fusk-it.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                autoFocus
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="login-field">
            <label className="login-label" htmlFor="admin-password">
              Password
            </label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input--has-eye"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="login-spinner" />
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Access Dashboard</span>
              </>
            )}
          </button>
          
          <div className="flex items-center gap-3 my-2 mt-4">
            <div className="flex-1 h-px bg-[rgba(240,217,192,0.1)]" />
            <span className="text-[10px] text-[rgba(240,217,192,0.5)] font-semibold uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-[rgba(240,217,192,0.1)]" />
          </div>

          <GoogleLoginButton onLogin={onLogin} />
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Restricted access · Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};
