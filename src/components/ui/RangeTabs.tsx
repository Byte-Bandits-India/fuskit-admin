import React, { useState } from 'react';

interface RangeTabsProps {
  tabs: string[];
  defaultTab?: string;
  onChange?: (tab: string) => void;
}

export const RangeTabs: React.FC<RangeTabsProps> = ({ tabs, defaultTab, onChange }) => {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);

  const handleClick = (tab: string) => {
    setActive(tab);
    onChange?.(tab);
  };

  return (
    <div
      className="flex gap-[2px] rounded-[7px] p-[2px]"
      style={{
        background: 'var(--bg-card2)',
        border: '1px solid var(--border)',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          className="px-[10px] py-1 rounded-[5px] text-[10px] font-semibold border-none cursor-pointer transition-all"
          style={{
            background: active === tab ? 'var(--orange)' : 'transparent',
            color: active === tab ? '#fff' : 'var(--text-muted)',
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
