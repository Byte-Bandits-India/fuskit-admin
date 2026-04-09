import React, { useState, useEffect, useRef } from 'react';
import type { Category } from '@/pages/CategoriesPage';

interface CategoryDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  category: Category | null;
  onClose: () => void;
  onSave: (data: { name: string; emoji: string; visible: boolean; order: number }) => void;
}

const EMOJI_OPTIONS = ['🥐', '🥤', '🍳', '⭐', '🍜', '🍟', '🍿', '🎬', '🍕', '🍔', '🧁', '🍦', '☕', '🧃', '🥗', '🌯'];

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({
  open,
  mode,
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🥐');
  const [visible, setVisible] = useState(true);
  const [order, setOrder] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  useEffect(() => {
    if (mode === 'edit' && category) {
      setName(category.name);
      setSelectedEmoji(category.emoji);
      setVisible(category.visible);
      setOrder(category.displayOrder ?? 1);
      setImagePreview(null);
    } else {
      setName('');
      setSelectedEmoji('🥐');
      setVisible(true);
      setOrder(9);
      setImagePreview(null);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [open, mode, category]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), emoji: selectedEmoji, visible, order });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] transition-opacity duration-[250ms]"
        style={{
          background: 'rgba(28,15,5,0.35)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col transition-transform duration-[280ms]"
        style={{
          width: 420,
          maxWidth: '100vw',
          background: 'var(--bg-card)',
          boxShadow: open ? '-8px 0 32px rgba(44,26,14,0.14)' : 'none',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-[18px] flex-shrink-0"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-card)',
          }}
        >
          <div>
            <div className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {mode === 'edit' ? 'Edit Category' : 'Add Category'}
            </div>
            <div className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
              {mode === 'edit' && category ? `Editing "${category.name}"` : 'Fill in the details below'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: 30, height: 30,
              background: 'var(--bg-card2)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)';
              (e.currentTarget as HTMLElement).style.color = 'var(--red)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Image upload */}
          <div className="mb-[18px]">
            <label className="text-xs font-semibold flex items-center gap-1 mb-[6px]" style={{ color: 'var(--text-primary)' }}>
              Category image <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Drop zone */}
            <div
              onClick={handleDropZoneClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all relative overflow-hidden"
              style={{
                height: 150,
                background: imagePreview ? 'transparent' : 'var(--bg-card2)',
                border: `2px dashed ${imagePreview ? 'var(--orange)' : 'var(--border-strong)'}`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
                if (!imagePreview) (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = imagePreview ? 'var(--orange)' : 'var(--border-strong)';
                if (!imagePreview) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
              }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.45)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                  >
                    <span className="text-white text-[11px] font-semibold">Click to change</span>
                  </div>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)' }}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Click or drag to upload image</span>
                  <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>PNG, JPG, WebP · Max 5MB · Recommended 400×300px</small>
                </>
              )}
            </div>

            {imagePreview && (
              <button
                onClick={e => { e.stopPropagation(); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="mt-[5px] text-[10px] cursor-pointer"
                style={{ background: 'none', border: 'none', color: 'var(--red)', textDecoration: 'underline', padding: 0 }}
              >
                Remove image
              </button>
            )}

            <div className="text-[10px] mt-[5px]" style={{ color: 'var(--text-muted)' }}>
              This image shows as the category card background on the website.
            </div>
          </div>

          {/* Category name */}
          <div className="mb-[18px]">
            <label className="text-xs font-semibold flex items-center gap-1 mb-[6px]" style={{ color: 'var(--text-primary)' }}>
              Category name <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Buns, Drinks, Signatures…"
              className="w-full px-3 py-[9px] rounded-lg text-[13px] outline-none transition-colors"
              style={{
                background: 'var(--bg-card2)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: "'Open Sans', sans-serif",
              }}
              onFocus={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
                (e.currentTarget as HTMLElement).style.background = '#fff';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
              }}
            />
            <div className="text-[10px] mt-[5px]" style={{ color: 'var(--text-muted)' }}>
              This is shown as the tab name on the menu page.
            </div>
          </div>

          {/* Icon picker */}
          <div className="mb-[18px]">
            <label className="text-xs font-semibold mb-[6px] block" style={{ color: 'var(--text-primary)' }}>
              Category icon
            </label>
            <div className="grid gap-[6px]" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className="flex items-center justify-center rounded-lg text-[18px] cursor-pointer transition-all"
                  style={{
                    width: 36, height: 36,
                    background: selectedEmoji === emoji ? 'var(--orange-light)' : 'var(--bg-card2)',
                    border: `1.5px solid ${selectedEmoji === emoji ? 'var(--orange)' : 'var(--border)'}`,
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-[10px] mt-[5px]" style={{ color: 'var(--text-muted)' }}>
              Icon shown on the category card and menu tabs.
            </div>
          </div>

          {/* Display order */}
          <div className="mb-[18px]">
            <label className="text-xs font-semibold mb-[6px] block" style={{ color: 'var(--text-primary)' }}>
              Display order
            </label>
            <input
              type="number"
              min={1}
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              placeholder="1"
              className="w-full px-3 py-[9px] rounded-lg text-[13px] outline-none transition-colors"
              style={{
                background: 'var(--bg-card2)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: "'Open Sans', sans-serif",
              }}
              onFocus={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
                (e.currentTarget as HTMLElement).style.background = '#fff';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
              }}
            />
            <div className="text-[10px] mt-[5px]" style={{ color: 'var(--text-muted)' }}>
              Lower number = appears first on the menu page.
            </div>
          </div>

          {/* Visibility toggle */}
          <div className="mb-[18px]">
            <label className="text-xs font-semibold mb-[6px] block" style={{ color: 'var(--text-primary)' }}>
              Visibility
            </label>
            <div
              className="flex items-center justify-between px-[14px] py-3 rounded-lg"
              style={{
                background: 'var(--bg-card2)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Show on website
                </div>
                <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
                  When off, this category is hidden from customers
                </div>
              </div>
              <div
                onClick={() => setVisible(!visible)}
                className="relative cursor-pointer flex-shrink-0 rounded-xl transition-colors duration-200"
                style={{
                  width: 42, height: 24,
                  background: visible ? 'var(--orange)' : '#D0C4B8',
                }}
              >
                <span
                  className="absolute top-[3px] rounded-full transition-all duration-200"
                  style={{
                    width: 18, height: 18,
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    right: visible ? 3 : 21,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Reorder hint */}
          <div
            className="flex items-center gap-2 px-3 py-[10px] rounded-lg text-[11px]"
            style={{
              background: 'var(--blue-bg)',
              border: '1px solid rgba(45,114,184,0.2)',
              color: 'var(--blue)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            You can drag to reorder categories from the main grid view at any time.
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-[10px] px-5 py-4 flex-shrink-0"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
          }}
        >
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
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-[10px] rounded-lg text-[13px] font-bold cursor-pointer transition-all"
            style={{
              background: 'var(--orange)',
              border: 'none',
              color: '#fff',
              fontFamily: "'Open Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(212,114,42,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--orange)';
            }}
          >
            {mode === 'edit' ? 'Save changes' : 'Save category'}
          </button>
        </div>
      </div>
    </>
  );
};
