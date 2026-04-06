import React from 'react';

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
}

export const Toggle: React.FC<ToggleProps> = ({ on, onToggle }) => (
  <div
    onClick={onToggle}
    className="relative cursor-pointer flex-shrink-0 rounded-[10px] transition-colors duration-200"
    style={{
      width: 36, height: 20,
      background: on ? 'var(--orange)' : '#D0C4B8',
    }}
  >
    <span
      className="absolute top-[2px] rounded-full transition-all duration-200"
      style={{
        width: 16, height: 16,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        right: on ? 2 : 18,
      }}
    />
  </div>
);
