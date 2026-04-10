import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '@/pages/MenuItemsPage';

interface ProductDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  product: Product | null;
  categories: string[];
  stores: string[];
  onClose: () => void;
  onSave: (data: Partial<Product> & { images?: File[]; video?: File | null; imagesToDelete?: string[] }) => void;
}

const EMOJI_OPTIONS = ['🥐', '🍗', '🥤', '🍟', '🍫', '🍨', '🍳', '🍜', '🧀', '☕', '🍕', '🍔', '🧁', '🍦', '🌯', '🍿'];

const BADGE_OPTIONS = [
  { key: 'bestseller', emoji: '⭐', label: 'Bestseller', bg: '#FFF8E1' },
  { key: 'new', emoji: '🆕', label: 'New item', bg: '#E3F2FD' },
  { key: 'trending', emoji: '🔥', label: 'Trending', bg: '#F3E5F5' },
  { key: 'seasonal', emoji: '🌱', label: 'Seasonal', bg: '#E8F5E9' },
];

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  open, mode, product, categories, stores, onClose, onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [price, setPrice] = useState<number | ''>('');
  const [oldPrice, setOldPrice] = useState<number | ''>('');
  const [addOnPrice, setAddOnPrice] = useState<number | ''>('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [storeSpecial, setStoreSpecial] = useState('');
  const [badges, setBadges] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState('🍽️');

  // Image / video upload state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files].slice(0, 5));
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 5));
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).slice(0, 5);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files].slice(0, 5));
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 5));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const removeImage = (idx: number) => {
    const url = imagePreviews[idx];
    if (url.startsWith('http') || url.startsWith('/')) {
      setImagesToDelete(prev => [...prev, url]);
    } else {
      const newFileIdx = imagePreviews.slice(0, idx).filter(u => !(u.startsWith('http') || u.startsWith('/'))).length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIdx));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };
  const removeVideo = () => { setVideoPreview(null); setVideoFile(null); if (videoInputRef.current) videoInputRef.current.value = ''; };

  useEffect(() => {
    if (mode === 'edit' && product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setIsVeg(product.isVeg);
      setPrice(product.price);
      setOldPrice(product.oldPrice || '');
      setSelectedStores(product.stores);
      setStoreSpecial(product.storeSpecial || '');
      setBadges(product.badges);
      setVisible(product.visible);
      setSelectedEmoji(product.emoji);
      setImagePreviews(product.imageUrls || []);
      setVideoPreview(product.videoUrl || null);
    } else {
      setName(''); setDescription(''); setAltText(''); setCategory('');
      setIsVeg(true); setPrice(''); setOldPrice(''); setAddOnPrice('');
      setSelectedStores(stores); setStoreSpecial('');
      setBadges([]); setVisible(true); setSelectedEmoji('🍽️');
      setImagePreviews([]);
      setVideoPreview(null);
    }
    // Reset media
    setImageFiles([]);
    setVideoFile(null);
    setImagesToDelete([]);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  }, [open, mode, product, stores]);

  const discount = price && oldPrice && oldPrice > price
    ? Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)
    : null;

  const toggleStore = (store: string) => {
    setSelectedStores(prev =>
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    );
  };

  const toggleBadge = (badge: string) => {
    setBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description,
      emoji: selectedEmoji,
      category,
      isVeg,
      price: Number(price) || 0,
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discountPercent: discount || undefined,
      stores: selectedStores,
      storeSpecial: storeSpecial || undefined,
      badges,
      visible,
      images: imageFiles,
      video: videoFile,
      imagesToDelete,
    });
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-card2)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif",
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

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col transition-transform duration-[280ms]"
        style={{
          width: 460, maxWidth: '100vw',
          background: 'var(--bg-card)',
          boxShadow: open ? '-8px 0 32px rgba(44,26,14,0.14)' : 'none',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <div className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {mode === 'edit' ? 'Edit Product' : 'Add Product'}
            </div>
            <div className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
              {mode === 'edit' && product ? `Editing "${product.name}"` : 'Fill in all product details below'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: 30, height: 30, background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
          >
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-[18px]">

          {/* ── Section: Basic info ── */}
          <SectionTitle icon="📋" label="Basic info" />

          <FormGroup label="Product name" required>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Bun Butter Jam"
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
            />
          </FormGroup>

          <FormGroup label="Description" required>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Short description shown on the menu card and product detail page…"
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors resize-y"
              style={{ ...inputStyle, minHeight: 72 }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
            />
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Keep it under 120 characters for best display.
            </div>
          </FormGroup>

          <FormGroup label="Alt text" optional="for SEO & accessibility">
            <input
              type="text" value={altText} onChange={e => setAltText(e.target.value)}
              placeholder="e.g. Fusk-it Bun Butter Jam — Chennai cafe signature bun"
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
            />
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Describes the image for search engines and screen readers.
            </div>
          </FormGroup>

          <FormGroup label="Category" required>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={inputStyle}
            >
              <option value="">Select a category…</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormGroup>

          <FormGroup label="Product icon">
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
          </FormGroup>

          <FormGroup label="Veg / Non-veg" required>
            <div className="flex gap-2">
              <button
                onClick={() => setIsVeg(true)}
                className="flex-1 flex items-center gap-[7px] px-[10px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                style={{
                  border: `1.5px solid ${isVeg ? 'var(--green)' : 'var(--border)'}`,
                  background: isVeg ? 'var(--green-bg)' : 'transparent',
                  color: isVeg ? 'var(--green)' : 'var(--text-secondary)',
                }}
              >
                <div className="flex items-center justify-center rounded-[3px] flex-shrink-0"
                  style={{ width: 14, height: 14, border: '2px solid currentColor' }}
                >
                  <div className="rounded-full" style={{ width: 7, height: 7, background: 'currentColor' }} />
                </div>
                Vegetarian
              </button>
              <button
                onClick={() => setIsVeg(false)}
                className="flex-1 flex items-center gap-[7px] px-[10px] py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                style={{
                  border: `1.5px solid ${!isVeg ? 'var(--red)' : 'var(--border)'}`,
                  background: !isVeg ? 'var(--red-bg)' : 'transparent',
                  color: !isVeg ? 'var(--red)' : 'var(--text-secondary)',
                }}
              >
                <div className="flex items-center justify-center rounded-[3px] flex-shrink-0"
                  style={{ width: 14, height: 14, border: '2px solid currentColor' }}
                >
                  <div className="rounded-full" style={{ width: 7, height: 7, background: 'currentColor' }} />
                </div>
                Non-vegetarian
              </button>
            </div>
          </FormGroup>

          {/* ── Section: Pricing ── */}
          <SectionTitle icon="🏷️" label="Pricing" />

          <div className="grid grid-cols-3 gap-[10px] mb-[14px]">
            <div>
              <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                Price <span style={{ color: 'var(--orange)' }}>*</span>
              </label>
              <input
                type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="₹ 89"
                className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                Old price <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span>
              </label>
              <input
                type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="₹ 109"
                className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>Discount</label>
              <input
                type="text" readOnly
                value={discount ? `-${discount}%` : '—'}
                className="w-full px-[11px] py-2 rounded-lg text-xs outline-none"
                style={{ ...inputStyle, background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          <FormGroup label="Add-on price" optional="optional">
            <input
              type="number" value={addOnPrice} onChange={e => setAddOnPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="₹ 20"
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
            />
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Shown as "+ Add-on: ₹20" on the menu item.
            </div>
          </FormGroup>

          {/* ── Section: Media ── */}
          <SectionTitle icon="🖼️" label="Images & video" />

          <FormGroup label="Product images" required>
            {/* Hidden file input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            {imagePreviews.length > 0 ? (
              <div className="flex flex-col gap-[8px]">
                <div className="grid gap-[6px]" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden group/img" style={{ height: 70 }}>
                      <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={e => { e.stopPropagation(); removeImage(i); }}
                        className="absolute top-1 right-1 flex items-center justify-center rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                        style={{ width: 18, height: 18, background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: '#fff' }}
                      >
                        <svg viewBox="0 0 24 24" className="w-[9px] h-[9px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center justify-center rounded-lg cursor-pointer transition-all"
                      style={{ height: 70, background: 'var(--bg-card2)', border: '2px dashed var(--border-strong)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)' }}><path d="M12 5v14M5 12h14" /></svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="text-[10px] cursor-pointer text-left"
                  style={{ background: 'none', border: 'none', color: 'var(--orange)', textDecoration: 'underline', padding: 0 }}
                >
                  Add more (up to 5)
                </button>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
                className="w-full flex flex-col items-center gap-[6px] rounded-[10px] p-4 cursor-pointer transition-all text-center"
                style={{ background: 'var(--bg-card2)', border: '2px dashed var(--border-strong)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)' }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Click or drag images here</span>
                <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>PNG, JPG, WebP · Max 5MB each · Up to 5 images</small>
              </div>
            )}
          </FormGroup>

          <FormGroup label="Product video" optional="optional">
            {/* Hidden video input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleVideoChange}
              style={{ display: 'none' }}
            />

            {videoPreview ? (
              <div className="relative rounded-[10px] overflow-hidden" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
                <video
                  src={videoPreview}
                  className="w-full rounded-[10px]"
                  style={{ maxHeight: 140, objectFit: 'cover' }}
                  controls
                  muted
                />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Video selected</span>
                  <button
                    onClick={removeVideo}
                    className="text-[10px] cursor-pointer"
                    style={{ background: 'none', border: 'none', color: 'var(--red)', textDecoration: 'underline', padding: 0 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => videoInputRef.current?.click()}
                onDrop={handleVideoDrop}
                onDragOver={handleDragOver}
                className="w-full flex flex-col items-center gap-[6px] rounded-[10px] p-4 cursor-pointer transition-all text-center"
                style={{ background: 'var(--bg-card2)', border: '2px dashed var(--border-strong)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Click or drag to upload video</span>
                <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>MP4, MOV · Max 30MB · Under 30 seconds recommended</small>
              </div>
            )}
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Shown as an autoplay loop on the menu card. Optional but great for engagement.
            </div>
          </FormGroup>

          {/* ── Section: Store availability ── */}
          <SectionTitle icon="📍" label="Store availability" />

          <div className="flex flex-col gap-[6px] mb-[14px]">
            {stores.map(store => (
              <button
                key={store}
                onClick={() => toggleStore(store)}
                className="flex items-center gap-[9px] px-[10px] py-2 rounded-lg cursor-pointer transition-all"
                style={{
                  background: selectedStores.includes(store) ? 'var(--orange-light)' : 'var(--bg-card2)',
                  border: `1px solid ${selectedStores.includes(store) ? 'var(--orange)' : 'var(--border)'}`,
                }}
              >
                <div
                  className="flex items-center justify-center rounded flex-shrink-0 transition-all"
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: selectedStores.includes(store) ? 'var(--orange)' : 'transparent',
                    border: `1.5px solid ${selectedStores.includes(store) ? 'var(--orange)' : 'var(--border-strong)'}`,
                  }}
                >
                  {selectedStores.includes(store) && (
                    <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium flex-1 text-left" style={{ color: 'var(--text-primary)' }}>{store}</span>
              </button>
            ))}
          </div>

          <FormGroup label="Special to a store" optional="optional">
            <select
              value={storeSpecial} onChange={e => setStoreSpecial(e.target.value)}
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none cursor-pointer"
              style={inputStyle}
            >
              <option value="">Not store-specific</option>
              {stores.map(s => <option key={s} value={`${s} Spl`}>{s} — show badge "{s} Spl"</option>)}
            </select>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Adds a coloured store badge on the menu card.
            </div>
          </FormGroup>

          {/* ── Section: Badges ── */}
          <SectionTitle icon="⭐" label="Badges & labels" />

          <div className="grid grid-cols-2 gap-2 mb-5">
            {BADGE_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => toggleBadge(opt.key)}
                className="flex items-center gap-2 px-[11px] py-[9px] rounded-lg cursor-pointer transition-all"
                style={{
                  background: badges.includes(opt.key) ? 'var(--orange-light)' : 'var(--bg-card2)',
                  border: `1.5px solid ${badges.includes(opt.key) ? 'var(--orange)' : 'var(--border)'}`,
                }}
              >
                <div
                  className="flex items-center justify-center rounded-[7px] flex-shrink-0 text-[15px]"
                  style={{ width: 28, height: 28, background: opt.bg }}
                >
                  {opt.emoji}
                </div>
                <span
                  className="text-[11px] font-semibold flex-1 text-left"
                  style={{ color: badges.includes(opt.key) ? 'var(--orange)' : 'var(--text-secondary)' }}
                >
                  {opt.label}
                </span>
                <div
                  className="flex items-center justify-center rounded flex-shrink-0 transition-all"
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: badges.includes(opt.key) ? 'var(--orange)' : 'transparent',
                    border: `1.5px solid ${badges.includes(opt.key) ? 'var(--orange)' : 'var(--border-strong)'}`,
                  }}
                >
                  {badges.includes(opt.key) && (
                    <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* ── Section: Visibility ── */}
          <SectionTitle icon="👁️" label="Visibility" />

          <div
            className="flex items-center justify-between px-[13px] py-[11px] rounded-lg mb-4"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
          >
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Show on website</div>
              <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>When off, customers cannot see this item</div>
            </div>
            <div
              onClick={() => setVisible(!visible)}
              className="relative cursor-pointer flex-shrink-0 rounded-[11px] transition-colors duration-200"
              style={{ width: 40, height: 22, background: visible ? 'var(--orange)' : '#D0C4B8' }}
            >
              <span
                className="absolute top-[3px] rounded-full transition-all duration-200"
                style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', right: visible ? 3 : 21 }}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div
          className="flex gap-[10px] px-5 py-[14px] flex-shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-[10px] rounded-lg text-[13px] cursor-pointer transition-all"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-[10px] rounded-lg text-[13px] font-bold cursor-pointer transition-all"
            style={{ background: 'var(--orange)', border: 'none', color: '#fff', fontFamily: "'Open Sans', sans-serif", boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}
          >
            {mode === 'edit' ? 'Save changes' : 'Save product'}
          </button>
        </div>
      </div>
    </>
  );
};


/* ─── Helpers ─── */

const SectionTitle: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div
    className="flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-[.08em] mb-[10px] pb-[6px] mt-5 first:mt-0"
    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
  >
    <span className="text-sm">{icon}</span>
    {label}
  </div>
);

interface FormGroupProps {
  label: string;
  required?: boolean;
  optional?: string;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, required, optional, children }) => (
  <div className="mb-[14px]">
    <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>
      {label}
      {required && <span style={{ color: 'var(--orange)' }}>*</span>}
      {optional && <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>({optional})</span>}
    </label>
    {children}
  </div>
);
