import React from 'react';

interface DeleteModalProps {
  open: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  categoryName,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-200"
      style={{
        background: 'rgba(28,15,5,0.4)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
      }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-7"
        style={{
          width: 360,
          maxWidth: '90vw',
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-md)',
          transform: open ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.2s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-[14px] mb-4"
          style={{
            width: 48, height: 48,
            background: 'var(--red-bg)',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--red)' }}>
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
          </svg>
        </div>

        {/* Title */}
        <div className="font-display text-[17px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Delete category?
        </div>

        {/* Body */}
        <div className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          You're about to delete <strong style={{ color: 'var(--text-primary)' }}>"{categoryName}"</strong>. This won't delete the items inside — they'll become uncategorised. This action cannot be undone.
        </div>

        {/* Actions */}
        <div className="flex gap-[10px]">
          <button
            onClick={onClose}
            className="px-4 py-[10px] rounded-lg text-[13px] cursor-pointer transition-all"
            style={{
              background: 'var(--bg-card2)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: "'Open Sans', sans-serif",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-[10px] rounded-lg text-[13px] font-bold cursor-pointer transition-colors"
            style={{
              background: loading ? '#c0392b' : 'var(--red)',
              border: 'none',
              color: '#fff',
              fontFamily: "'Open Sans', sans-serif",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#a83030'; }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--red)'; }}
          >
            {loading && (
              <svg className="animate-spin" viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            )}
            {loading ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
