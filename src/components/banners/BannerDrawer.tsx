import React, { useState, useEffect } from 'react';
import type { Banner, BannerType } from '@/pages/BannerSettingsPage';

interface BannerDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: Partial<Banner>) => void;
}

const TYPE_OPTIONS: { key: BannerType; emoji: string; label: string; sub: string; bg: string }[] = [
  { key: 'hero', emoji: '🖼️', label: 'Hero', sub: 'Full-width homepage', bg: 'var(--orange-light)' },
  { key: 'menu', emoji: '🍽️', label: 'Menu banner', sub: 'Inside menu sections', bg: 'var(--blue-bg)' },
  { key: 'announcement', emoji: '📢', label: 'Announcement', sub: 'Top bar text strip', bg: 'var(--green-bg)' },
  { key: 'popup', emoji: '💬', label: 'Popup', sub: 'Overlay on page load', bg: 'var(--purple-bg)' },
];

export const BannerDrawer: React.FC<BannerDrawerProps> = ({ open, mode, banner, onClose, onSave }) => {
  const [type, setType] = useState<BannerType>('hero');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [altText, setAltText] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [order, setOrder] = useState(1);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (mode === 'edit' && banner) {
      setType(banner.type); setName(banner.name); setTitle(banner.title);
      setSubtitle(banner.subtitle || ''); setAltText(banner.altText || '');
      setCtaLabel(banner.ctaLabel || ''); setCtaLink(banner.ctaLink || '');
      setOrder(banner.order); setEnabled(banner.enabled);
    } else {
      setType('hero'); setName(''); setTitle(''); setSubtitle(''); setAltText('');
      setCtaLabel(''); setCtaLink(''); setOrder(1); setScheduleEnabled(true);
      setStartDate(''); setStartTime('00:00'); setEndDate(''); setEndTime('23:59'); setEnabled(true);
    }
  }, [open, mode, banner]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ type, name, title, subtitle, altText, ctaLabel, ctaLink, enabled, order });
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-card2)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif",
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] transition-opacity duration-[250ms]"
        style={{ background: 'rgba(28,15,5,0.35)', opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }}
        onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col transition-transform duration-[280ms]"
        style={{ width: 460, maxWidth: '100vw', background: 'var(--bg-card)', boxShadow: open ? '-8px 0 32px rgba(44,26,14,0.14)' : 'none', transform: open ? 'translateX(0)' : 'translateX(100%)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>{mode === 'edit' ? 'Edit Banner' : 'Add Banner'}</div>
            <div className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
              {mode === 'edit' && banner ? `Editing "${banner.name}"` : 'Configure all banner settings below'}
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: 30, height: 30, background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-[18px]">

          {/* Banner Type */}
          <SectionTitle label="Banner type" hint="Select one" />
          <div className="grid grid-cols-2 gap-2 mb-5">
            {TYPE_OPTIONS.map(t => (
              <button key={t.key} onClick={() => setType(t.key)}
                className="flex items-center gap-[9px] px-3 py-[10px] rounded-[10px] cursor-pointer transition-all"
                style={{
                  border: `1.5px solid ${type === t.key ? 'var(--orange)' : 'var(--border)'}`,
                  background: type === t.key ? 'var(--orange-light)' : 'transparent',
                }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0 text-[16px]" style={{ width: 30, height: 30, background: t.bg }}>{t.emoji}</div>
                <div className="text-left">
                  <div className="text-xs font-semibold" style={{ color: type === t.key ? 'var(--orange)' : 'var(--text-secondary)' }}>{t.label}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Basic Info */}
          <SectionTitle label="Basic info" />
          <FormGroup label="Internal name" required>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Homepage Hero — Buns Season"
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Only visible in admin. Helps you identify banners.</div>
          </FormGroup>
          <FormGroup label="Title / Headline" required>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fusk boring desserts."
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
          </FormGroup>
          <FormGroup label="Subtitle" optional="optional">
            <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Bold buns, signature drinks & indulgent treats."
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
          </FormGroup>
          <FormGroup label="Alt text" optional="for SEO">
            <input type="text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="Describe the banner image for search engines"
              className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
          </FormGroup>

          {/* CTA */}
          <SectionTitle label="CTA button" hint="optional for announcement banners" />
          <div className="grid grid-cols-2 gap-[10px] mb-5">
            <div>
              <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>Button label</label>
              <input type="text" value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} placeholder="e.g. Explore Menu →"
                className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
            </div>
            <div>
              <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>Button link / URL</label>
              <input type="text" value={ctaLink} onChange={e => setCtaLink(e.target.value)} placeholder="/menu/buns"
                className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
            </div>
          </div>

          {/* Images */}
          <SectionTitle label="Images" />
          <FormGroup label="Desktop image" required>
            <UploadZone label="Click to upload desktop image" hint="PNG, JPG, WebP · 1920×600px recommended · Max 5MB" />
          </FormGroup>
          <FormGroup label="Mobile image" optional="optional — uses desktop if empty">
            <UploadZone label="Click to upload mobile image" hint="PNG, JPG, WebP · 768×500px recommended · Max 3MB" isMobile />
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Shown on screens under 768px. Recommended for hero banners for best appearance.</div>
          </FormGroup>

          {/* Display order */}
          <SectionTitle label="Display order" />
          <FormGroup label="Order position">
            <input type="number" min={1} value={order} onChange={e => setOrder(Number(e.target.value))}
              className="px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" style={{ ...inputStyle, maxWidth: 120 }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }} />
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Lower number = shown first. For hero banners with multiple slides, this controls slide order.</div>
          </FormGroup>

          {/* Schedule */}
          <SectionTitle label="Schedule" />
          <div className="flex items-center justify-between px-3 py-[10px] rounded-lg mb-[10px]" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Set a schedule</div>
              <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Control exactly when this banner goes live and expires</div>
            </div>
            <div onClick={() => setScheduleEnabled(!scheduleEnabled)} className="relative cursor-pointer flex-shrink-0 rounded-[10px] transition-colors duration-200"
              style={{ width: 36, height: 20, background: scheduleEnabled ? 'var(--orange)' : '#D0C4B8' }}>
              <span className="absolute top-[2px] rounded-full transition-all duration-200" style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', right: scheduleEnabled ? 2 : 18 }} />
            </div>
          </div>
          <div style={{ opacity: scheduleEnabled ? 1 : 0.4, pointerEvents: scheduleEnabled ? 'all' : 'none' }}>
            <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
              <div>
                <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>Start date <span style={{ color: 'var(--orange)' }}>*</span></label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-[11px] py-2 rounded-lg text-xs outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>Start time</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-[11px] py-2 rounded-lg text-xs outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
              <div>
                <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>End date <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span></label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-[11px] py-2 rounded-lg text-xs outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>End time</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-[11px] py-2 rounded-lg text-xs outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="flex items-start gap-[7px] px-3 py-[9px] rounded-lg mb-[10px]" style={{ background: 'var(--orange-light)', border: '1px solid rgba(212,114,42,0.2)', color: 'var(--orange)', fontSize: 11 }}>
              <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] flex-shrink-0 mt-[1px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              The banner automatically goes live at the start time and is hidden after the end date — no manual action needed.
            </div>
          </div>

          {/* Visibility */}
          <SectionTitle label="Visibility" />
          <div className="flex items-center justify-between px-[13px] py-[11px] rounded-lg mb-4" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Enable banner</div>
              <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>When off, this banner is hidden from the website regardless of schedule</div>
            </div>
            <div onClick={() => setEnabled(!enabled)} className="relative cursor-pointer flex-shrink-0 rounded-[11px] transition-colors duration-200"
              style={{ width: 40, height: 22, background: enabled ? 'var(--orange)' : '#D0C4B8' }}>
              <span className="absolute top-[3px] rounded-full transition-all duration-200" style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', right: enabled ? 3 : 21 }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-[10px] px-5 py-[14px] flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} className="px-4 py-[10px] rounded-lg text-[13px] cursor-pointer transition-all"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}>Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-[10px] rounded-lg text-[13px] font-bold cursor-pointer transition-all"
            style={{ background: 'var(--orange)', border: 'none', color: '#fff', fontFamily: "'Open Sans', sans-serif", boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}>
            {mode === 'edit' ? 'Save changes' : 'Save banner'}
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Helpers ─── */
const SectionTitle: React.FC<{ label: string; hint?: string }> = ({ label, hint }) => (
  <div className="flex items-center gap-[6px] text-[11px] font-bold uppercase tracking-[.08em] mb-[10px] pb-[6px] mt-5 first:mt-0"
    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
    {label}
    {hint && <span className="text-[10px] font-normal normal-case tracking-normal ml-1" style={{ color: 'var(--text-muted)' }}>{hint}</span>}
  </div>
);

const FormGroup: React.FC<{ label: string; required?: boolean; optional?: string; children: React.ReactNode }> = ({ label, required, optional, children }) => (
  <div className="mb-[13px]">
    <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>
      {label}
      {required && <span style={{ color: 'var(--orange)' }}>*</span>}
      {optional && <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>{optional}</span>}
    </label>
    {children}
  </div>
);

const UploadZone: React.FC<{ label: string; hint: string; isMobile?: boolean }> = ({ label, hint, isMobile }) => (
  <div className="w-full flex flex-col items-center gap-[6px] rounded-[10px] p-4 cursor-pointer transition-all text-center"
    style={{ background: 'var(--bg-card2)', border: '2px dashed var(--border-strong)' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}>
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)' }}>
      {isMobile ? (
        <><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="1" /></>
      ) : (
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      )}
    </svg>
    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
    <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{hint}</small>
  </div>
);
