import React from 'react';
import { cn } from '@/utils/cn';
import { Toggle } from '@/components/ui/Toggle';
import type { Product } from '@/pages/MenuItemsPage';

interface ProductCardProps {
  product: Product;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/* ─── Icons ─── */
const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

const CategorySmIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

/* ─── Badge styles ─── */
const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  bestseller: { bg: '#FFF8E1', color: '#E65100', label: 'Bestseller' },
  new: { bg: '#E3F2FD', color: '#1565C0', label: 'New' },
  trending: { bg: '#F3E5F5', color: '#7C4DB8', label: 'Trending' },
  seasonal: { bg: '#E8F5E9', color: '#2D8653', label: 'Seasonal' },
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={cn(
        'rounded-[14px] overflow-hidden cursor-pointer transition-all duration-[180ms] relative',
        !product.visible && 'opacity-60'
      )}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        animation: `fadeUp 0.5s ease ${index * 0.04}s both`,
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
      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: 140, background: product.bgColor }}
      >
        {/* Background faded emoji – hidden when a real image exists */}
        {!product.imageUrls?.[0] && (
          <div className="absolute inset-0 flex items-center justify-center text-[80px] opacity-10 select-none">
            {product.emoji}
          </div>
        )}
        {/* Foreground: first imageUrl if available, else emoji */}
        {product.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="text-[52px] z-[1] select-none">{product.emoji}</div>
        )}

        {/* Badges top-left */}
        {product.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-[2]">
            {product.badges.map(badge => {
              const s = BADGE_STYLES[badge];
              return s ? (
                <span
                  key={badge}
                  className="text-[9px] font-bold px-[7px] py-[2px] rounded-[20px] inline-block whitespace-nowrap"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
              ) : null;
            })}
            {product.storeSpecial && (
              <span
                className="text-[9px] font-bold px-[7px] py-[2px] rounded-[20px] inline-block whitespace-nowrap"
                style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
              >
                {product.storeSpecial}
              </span>
            )}
            {product.discountPercent && product.discountPercent > 0 && !product.badges.includes('discount') && (
              <span
                className="text-[9px] font-bold px-[7px] py-[2px] rounded-[20px] inline-block whitespace-nowrap"
                style={{ background: 'var(--red-bg)', color: 'var(--red)' }}
              >
                -{product.discountPercent}%
              </span>
            )}
          </div>
        )}
        {/* Store special badge if no other badges */}
        {product.badges.length === 0 && product.storeSpecial && (
          <div className="absolute top-2 left-2 z-[2]">
            <span
              className="text-[9px] font-bold px-[7px] py-[2px] rounded-[20px] inline-block whitespace-nowrap"
              style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
            >
              {product.storeSpecial}
            </span>
          </div>
        )}
        {/* Discount badge if no other badges */}
        {product.badges.length === 0 && !product.storeSpecial && product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-[2]">
            <span
              className="text-[9px] font-bold px-[7px] py-[2px] rounded-[20px] inline-block"
              style={{ background: 'var(--red-bg)', color: 'var(--red)' }}
            >
              -{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Status badge top-right */}
        <span
          className="absolute top-2 right-2 text-[9px] font-bold px-2 py-[3px] rounded-[20px] z-[2]"
          style={
            product.visible
              ? { background: 'var(--green-bg)', color: 'var(--green)' }
              : { background: 'var(--red-bg)', color: 'var(--red)' }
          }
        >
          {product.visible ? 'Visible' : 'Hidden'}
        </span>

        {/* Veg / Non-veg dot bottom-left */}
        <div className="absolute bottom-2 left-2 z-[2]">
          <div
            className="flex items-center justify-center rounded-[3px]"
            style={{
              width: 16, height: 16,
              border: `2px solid ${product.isVeg ? 'var(--green)' : 'var(--red)'}`,
              background: '#fff',
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 8, height: 8,
                background: product.isVeg ? 'var(--green)' : 'var(--red)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-3 pt-[10px] pb-2">
        <div
          className="font-display text-[13px] font-bold mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.name}
        </div>
        <div className="flex items-center gap-1 text-[10px] mb-[7px]" style={{ color: 'var(--text-muted)' }}>
          <CategorySmIcon />
          {product.category}
        </div>

        {/* Price row */}
        <div className="flex items-center gap-[6px] flex-wrap">
          <span className="font-display text-[15px] font-bold" style={{ color: 'var(--orange)' }}>
            ₹{product.price}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] line-through" style={{ color: 'var(--text-muted)' }}>
              ₹{product.oldPrice}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span
              className="text-[9px] font-bold px-[6px] py-[2px] rounded-[10px]"
              style={{ background: 'var(--red-bg)', color: 'var(--red)' }}
            >
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className="text-[10px] mt-[5px] leading-[1.5] overflow-hidden"
          style={{
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </p>

        {/* Store chips */}
        <div className="flex gap-1 mt-[6px] flex-wrap">
          {product.stores.map(store => (
            <span
              key={store}
              className={cn(
                'text-[9px] px-[7px] py-[2px] rounded-[10px] font-medium',
                product.storeSpecial && product.stores.length === 1 ? '' : ''
              )}
              style={
                product.storeSpecial && product.stores.length === 1
                  ? { background: 'var(--purple-bg)', border: '1px solid rgba(124,77,184,0.2)', color: 'var(--purple)' }
                  : { background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
              }
            >
              {product.storeSpecial && product.stores.length === 1 ? `${store} only` : store}
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center gap-[6px] px-3 py-2"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card2)',
        }}
      >
        <span
          className="text-[10px] flex-1"
          style={{ color: product.visible ? 'var(--text-secondary)' : 'var(--red)' }}
        >
          {product.visible ? 'Visible' : 'Hidden'}
        </span>

        {/* Edit */}
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="flex items-center justify-center rounded-[6px] flex-shrink-0 transition-all duration-[120ms] edit-btn"
          style={{
            width: 24, height: 24,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
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

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="flex items-center justify-center rounded-[6px] flex-shrink-0 transition-all duration-[120ms] del-btn"
          style={{
            width: 24, height: 24,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
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
        <Toggle on={product.visible} onToggle={onToggle} />
      </div>
    </div>
  );
};
