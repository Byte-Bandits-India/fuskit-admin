import React from 'react';

export const CustomerLoginNote: React.FC = () => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-[10px]"
    style={{
      background: 'var(--blue-bg)',
      border: '1px solid rgba(45,114,184,0.2)',
    }}
  >
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--blue)' }}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
    <p className="flex-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
      <strong style={{ color: 'var(--text-primary)' }}>Customer login</strong>
      {' '}is now enabled — users can save their favourite items and track order history via their profile.
    </p>
    <button
      className="text-[10px] font-bold px-3 py-1 rounded-[6px] cursor-pointer border-none whitespace-nowrap"
      style={{
        background: 'var(--blue-bg)',
        border: '1px solid rgba(45,114,184,0.25)',
        color: 'var(--blue)',
        fontFamily: 'Open Sans, sans-serif',
      }}
    >
      View customers
    </button>
  </div>
);
