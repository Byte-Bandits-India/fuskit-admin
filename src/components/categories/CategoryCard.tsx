import React from 'react';
import { cn } from '@/utils/cn';
import { Toggle } from '@/components/ui/Toggle';
import type { Category } from '@/pages/CategoriesPage';

interface CategoryCardProps {
  category: Category;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/* ─── Icons ─── */
const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

const ClipboardSmIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
  </svg>
);

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={cn(
        'rounded-[14px] overflow-hidden cursor-pointer transition-all duration-[180ms] relative group',
        !category.visible && 'opacity-[0.65]'
      )}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        animation: `fadeUp 0.5s ease ${index * 0.05}s both`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: 130, background: category.bgColor }}
      >
        {/* Background emoji (large, faded) */}
        <div className="absolute text-[64px] opacity-[0.18] select-none">{category.emoji}</div>
        {/* Foreground emoji */}
        <div className="text-[48px] z-[1] select-none">{category.emoji}</div>

        {/* Icon badge */}
        <div
          className="absolute top-[10px] left-[10px] flex items-center justify-center rounded-[10px] text-[18px]"
          style={{
            width: 34, height: 34,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(44,26,14,0.15)',
          }}
        >
          {category.emoji}
        </div>

        {/* Status badge */}
        <span
          className="absolute top-[10px] right-[10px] text-[9px] font-bold px-2 py-[3px] rounded-[20px]"
          style={
            category.visible
              ? { background: 'var(--green-bg)', color: 'var(--green)' }
              : { background: 'var(--red-bg)', color: 'var(--red)' }
          }
        >
          {category.visible ? 'Visible' : 'Hidden'}
        </span>
      </div>

      {/* Body */}
      <div className="px-[14px] py-3">
        <div className="font-display text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {category.name}
        </div>
        <div className="flex items-center gap-[6px]">
          <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <ClipboardSmIcon />
            {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
          </span>
          <span
            className="rounded-full flex-shrink-0"
            style={{ width: 3, height: 3, background: 'var(--border-strong)' }}
          />
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {category.type}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 px-[14px] py-[10px]"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card2)',
        }}
      >
        {/* Drag handle */}
        <div className="flex flex-col gap-[2px] cursor-grab px-[2px] flex-shrink-0">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block rounded-[2px]"
              style={{ width: 12, height: 2, background: 'var(--border-strong)' }}
            />
          ))}
        </div>

        <span className="text-[11px] flex-1" style={{ color: 'var(--text-secondary)' }}>
          Show on site
        </span>

        {/* Edit button */}
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="flex items-center justify-center rounded-[6px] flex-shrink-0 transition-all duration-[120ms]"
          style={{
            width: 26, height: 26,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--orange-light)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
            (e.currentTarget as HTMLElement).style.color = 'var(--orange)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          <EditIcon />
        </button>

        {/* Delete button */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="flex items-center justify-center rounded-[6px] flex-shrink-0 transition-all duration-[120ms]"
          style={{
            width: 26, height: 26,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)';
            (e.currentTarget as HTMLElement).style.color = 'var(--red)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          <TrashIcon />
        </button>

        {/* Toggle */}
        <Toggle on={category.visible} onToggle={onToggle} />
      </div>
    </div>
  );
};
