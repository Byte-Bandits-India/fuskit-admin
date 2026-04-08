import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
};

const STYLES: Record<ToastType, { bg: string; border: string; icon: string; bar: string }> = {
  success: {
    bg: 'var(--bg-card)',
    border: 'var(--green)',
    icon: 'var(--green)',
    bar: 'var(--green)',
  },
  error: {
    bg: 'var(--bg-card)',
    border: 'var(--red)',
    icon: 'var(--red)',
    bar: 'var(--red)',
  },
  warning: {
    bg: 'var(--bg-card)',
    border: '#E08B3A',
    icon: '#E08B3A',
    bar: '#E08B3A',
  },
};

const DURATION = 4000;

const SingleToast: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const s = STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderLeft: `3px solid ${s.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        borderRadius: 10,
        overflow: 'hidden',
        minWidth: 280,
        maxWidth: 380,
        animation: 'toast-in 0.25s ease',
      }}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0 mt-[1px]"
          style={{ width: 26, height: 26, background: `${s.icon}18`, color: s.icon }}
        >
          {ICONS[toast.type]}
        </div>

        {/* Message */}
        <span className="text-[13px] leading-snug flex-1" style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}>
          {toast.message}
        </span>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex items-center justify-center rounded flex-shrink-0 mt-[1px] transition-opacity"
          style={{ width: 20, height: 20, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
        >
          <svg viewBox="0 0 24 24" className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: `${s.bar}22` }}>
        <div
          style={{
            height: '100%',
            background: s.bar,
            animation: `toast-bar ${DURATION}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-bar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div
        className="fixed z-[500] flex flex-col gap-2"
        style={{ bottom: 24, right: 24 }}
      >
        {toasts.map(t => (
          <SingleToast key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
};
