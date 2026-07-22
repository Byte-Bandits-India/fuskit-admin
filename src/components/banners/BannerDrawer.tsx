import React, { useState, useEffect, useRef } from 'react';
import type { Banner, BannerType } from '@/pages/BannerSettingsPage';

interface BannerDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  banner: Banner | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

const TYPE_OPTIONS: { key: BannerType; emoji: string; label: string; sub: string; bg: string; color: string }[] = [
  { key: 'hero',         emoji: '🖼️',  label: 'Hero',         sub: 'Full-width homepage hero', bg: 'var(--orange-light)', color: 'var(--orange)' },
  { key: 'menu',         emoji: '🎬',  label: 'Reel / Menu',  sub: 'Reel cards & menu promo', bg: 'var(--blue-bg)',     color: 'var(--blue)'   },
  { key: 'announcement', emoji: '📢',  label: 'Announcement', sub: 'Story, Locations, Top bar', bg: 'var(--green-bg)', color: 'var(--green)'  },
  { key: 'popup',        emoji: '💬',  label: 'Popup',        sub: 'Overlay on page load',      bg: 'var(--purple-bg)', color: 'var(--purple)' },
];

// ─── Per-type field configuration ────────────────────────────────────────────
interface FieldConfig {
  namePlaceholder: string;
  nameHint: string;
  titleLabel: string;
  titlePlaceholder: string;
  subtitleLabel: string;
  subtitlePlaceholder: string;
  subtitleHint?: string;
  ctaLabelLabel: string;
  ctaLabelPlaceholder: string;
  ctaLinkLabel: string;
  ctaLinkPlaceholder: string;
  ctaLinkHint?: string;
  showVideo: boolean;
  showDesktopImage: boolean;
  showMobileImage: boolean;
  desktopImageLabel: string;
  desktopImageHint: string;
  mobileImageLabel?: string;
  mobileImageHint?: string;
  altTextHint?: string;
}

function getFieldConfig(type: BannerType, name: string): FieldConfig {
  const cleanName = (name || '').toLowerCase().trim();
  const isReel = type === 'menu' || cleanName.startsWith('reel');
  const isStory = cleanName.startsWith('story');
  const isLocations = cleanName.startsWith('location');

  if (type === 'hero') return {
    namePlaceholder: 'e.g. Homepage Hero — July 2026',
    nameHint: 'Any name — the first active hero banner is shown on the homepage.',
    titleLabel: 'Heading (line 1)',
    titlePlaceholder: 'e.g. EVERY SNACK STARTS A',
    subtitleLabel: 'Heading accent | Body text',
    subtitlePlaceholder: 'e.g. story.|From kadak chai breaks to late-night bajji cravings...',
    subtitleHint: 'Use | to separate the italic accent word from the body paragraph. Example: story.|Body text here.',
    ctaLabelLabel: 'Primary CTA button label',
    ctaLabelPlaceholder: 'e.g. EXPLORE MENU',
    ctaLinkLabel: 'Primary CTA link / href',
    ctaLinkPlaceholder: 'e.g. #menu or /menu',
    showVideo: false, showDesktopImage: true, showMobileImage: true,
    desktopImageLabel: 'Desktop background image',
    desktopImageHint: 'Full-width hero bg · PNG, JPG, WebP · 1920×620px · Max 5MB',
    mobileImageLabel: 'Mobile background image',
    mobileImageHint: 'Shown on phones · 768×500px recommended · Max 5MB',
  };

  if (type === 'menu') return {
    namePlaceholder: isReel ? 'reel:1' : 'e.g. reel:1 (for reel cards) or Summer Promo',
    nameHint: 'For reel cards: use reel:1, reel:2, reel:3, reel:4. Up to 4 reel banners appear on the homepage.',
    titleLabel: isReel ? 'Badge chip text' : 'Title / Headline',
    titlePlaceholder: isReel ? 'e.g. REEL, VIRAL, NEW, HOT' : 'e.g. Summer Promo',
    subtitleLabel: isReel ? 'Card caption' : 'Subtitle (optional)',
    subtitlePlaceholder: isReel ? "e.g. That's it." : 'Additional details',
    ctaLabelLabel: isReel ? 'Badge label (optional)' : 'CTA button label',
    ctaLabelPlaceholder: isReel ? 'e.g. REEL' : 'e.g. Explore Menu →',
    ctaLinkLabel: 'Video URL (or upload a file below)',
    ctaLinkPlaceholder: 'e.g. /videos/1.mp4 or https://...',
    ctaLinkHint: 'Enter a URL OR upload a video file below — uploaded file takes priority over this field.',
    showVideo: true, showDesktopImage: true, showMobileImage: false,
    desktopImageLabel: isReel ? 'Poster / fallback image' : 'Banner image',
    desktopImageHint: isReel
      ? 'Shown while video loads or if no video · 9:16 ratio recommended · Max 5MB'
      : 'Banner image · PNG, JPG, WebP · Max 5MB',
  };

  if (isStory) return {
    namePlaceholder: 'story',
    nameHint: 'Must be exactly "story" to target the About / Story section.',
    titleLabel: 'Heading (use | to add italic accent)',
    titlePlaceholder: 'e.g. More Than a Cafe — A|Snack Culture.',
    subtitleLabel: 'Body paragraphs (pipe-separated)',
    subtitlePlaceholder: 'e.g. Para 1 text here.|Para 2 text here.',
    subtitleHint: 'Separate paragraphs with |. Each segment becomes its own paragraph.',
    ctaLabelLabel: 'Eyebrow text',
    ctaLabelPlaceholder: 'e.g. WELCOME TO FUSK-IT',
    ctaLinkLabel: 'CTA link (optional)',
    ctaLinkPlaceholder: 'e.g. /about',
    showVideo: false, showDesktopImage: true, showMobileImage: false,
    desktopImageLabel: 'Left-side section image',
    desktopImageHint: 'Shown on the left of the story section · 4:3 ratio · Max 5MB',
  };

  if (isLocations) return {
    namePlaceholder: 'locations',
    nameHint: 'Must be exactly "locations" to target the Locations Teaser section.',
    titleLabel: 'Section heading (use | for accent)',
    titlePlaceholder: 'e.g. Find a Fusk-it Near|you.',
    subtitleLabel: 'Stats (stores|cities|symbol)',
    subtitlePlaceholder: 'e.g. 4|2|∞',
    subtitleHint: 'Pipe-separated: stores count | cities count | third stat symbol. Example: 4|2|∞',
    ctaLabelLabel: 'CTA button text',
    ctaLabelPlaceholder: 'e.g. VIEW ALL STORES',
    ctaLinkLabel: 'CTA button link',
    ctaLinkPlaceholder: 'e.g. /locations',
    showVideo: false, showDesktopImage: false, showMobileImage: false,
    desktopImageLabel: '',
    desktopImageHint: '',
  };

  if (type === 'announcement') return {
    namePlaceholder: 'e.g. story, locations, or Summer Promo',
    nameHint: 'Use "story" for the About section, "locations" for the Locations Teaser, or any name for the top bar.',
    titleLabel: 'Announcement text',
    titlePlaceholder: 'e.g. 🔥 Now open in Hyderabad!',
    subtitleLabel: 'Subtitle (optional)',
    subtitlePlaceholder: 'Additional details',
    ctaLabelLabel: 'CTA button label',
    ctaLabelPlaceholder: 'e.g. See Menu',
    ctaLinkLabel: 'CTA link',
    ctaLinkPlaceholder: 'e.g. /menu',
    showVideo: false, showDesktopImage: false, showMobileImage: false,
    desktopImageLabel: '',
    desktopImageHint: '',
  };

  return {
    namePlaceholder: 'e.g. Welcome Popup — July',
    nameHint: 'Only visible in admin. Identifies this popup in the list.',
    titleLabel: 'Popup headline',
    titlePlaceholder: 'e.g. Exclusive deal just for you!',
    subtitleLabel: 'Popup body text',
    subtitlePlaceholder: 'e.g. Order now and get 10% off your first bite.',
    ctaLabelLabel: 'CTA button label',
    ctaLabelPlaceholder: 'e.g. Claim Offer',
    ctaLinkLabel: 'CTA link / href',
    ctaLinkPlaceholder: 'e.g. /menu',
    showVideo: false, showDesktopImage: true, showMobileImage: false,
    desktopImageLabel: 'Popup image',
    desktopImageHint: 'Shown at top of popup · Square or landscape · Max 5MB',
  };
}

export const BannerDrawer: React.FC<BannerDrawerProps> = ({ open, mode, banner, onClose, onSave }) => {
  const [type, setType] = useState<BannerType>('hero');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [altText, setAltText] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [order, setOrder] = useState(1);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');
  const [enabled, setEnabled] = useState(true);

  // Validation & Submitting state
  const [errors, setErrors] = useState<{ name?: string; title?: string; desktopImage?: string; video?: string; schedule?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File selection state
  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Blob preview URLs (managed via useEffect for clean memory lifecycle)
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string | null>(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // Existing media preview (edit mode)
  const [existingDesktopUrl, setExistingDesktopUrl] = useState<string | null>(null);
  const [existingMobileUrl, setExistingMobileUrl] = useState<string | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);

  // Deletion flags for existing files
  const [removeDesktopImage, setRemoveDesktopImage] = useState(false);
  const [removeMobileImage, setRemoveMobileImage] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);

  const desktopRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cfg = getFieldConfig(type, name);
  const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  function resolveUrl(url?: string | null): string | null {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url.replace(/^\/api/, '')}`;
  }

  // Handle banner type tab switching cleanly
  const handleTypeChange = (newType: BannerType) => {
    setType(newType);
    setErrors(prev => ({ ...prev, video: undefined, desktopImage: undefined, general: undefined }));

    const newCfg = getFieldConfig(newType, name);

    // If switching to a type that doesn't support video (like hero, announcement, popup, story, locations), purge video files
    if (!newCfg.showVideo) {
      setVideoFile(null);
      setExistingVideoUrl(null);
      setRemoveVideo(true);
      if (videoRef.current) videoRef.current.value = '';
      if (ctaLink && (ctaLink.includes('/uploads/banners/') || ctaLink.match(/\.(mp4|webm|mov)$/i))) {
        setCtaLink('');
      }
    }

    // If switching to a type that doesn't support mobile image, purge mobile image
    if (!newCfg.showMobileImage) {
      setMobileImage(null);
      setExistingMobileUrl(null);
      setRemoveMobileImage(true);
      if (mobileRef.current) mobileRef.current.value = '';
    }
  };

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Load banner data into state
  useEffect(() => {
    setErrors({});
    setIsSubmitting(false);
    setRemoveDesktopImage(false);
    setRemoveMobileImage(false);
    setRemoveVideo(false);

    if (mode === 'edit' && banner) {
      setType(banner.type);
      setName(banner.name);
      setTitle(banner.title);
      setSubtitle(banner.subtitle || '');
      setAltText(banner.altText || '');
      setCtaLabel(banner.ctaLabel || '');

      // Existing media previews
      setExistingDesktopUrl(resolveUrl(banner.desktopImageUrl));
      setExistingMobileUrl(resolveUrl(banner.mobileImageUrl));

      const ctaIsVideo = banner.ctaLink && (
        banner.ctaLink.includes('/uploads/banners/') ||
        banner.ctaLink.includes('/api/uploads/banners/') ||
        banner.ctaLink.match(/\.(mp4|webm|mov)$/i)
      );

      if (ctaIsVideo) {
        setExistingVideoUrl(resolveUrl(banner.ctaLink));
        setCtaLink(''); // Clear text field so raw video upload path isn't shown
      } else {
        setExistingVideoUrl(null);
        setCtaLink(banner.ctaLink || '');
      }

      setOrder(banner.order ?? (banner as any).displayOrder ?? 1);
      setEnabled(banner.enabled);
      setScheduleEnabled(banner.scheduleEnabled ?? false);
      setStartDate(banner.startDate ? String(banner.startDate).split('T')[0] : '');
      setStartTime(banner.startTime ?? '00:00');
      setEndDate(banner.endDate ? String(banner.endDate).split('T')[0] : '');
      setEndTime(banner.endTime ?? '23:59');
    } else {
      setType('hero'); setName(''); setTitle(''); setSubtitle(''); setAltText('');
      setCtaLabel(''); setCtaLink(''); setOrder(1); setScheduleEnabled(false);
      setStartDate(''); setStartTime('00:00'); setEndDate(''); setEndTime('23:59');
      setEnabled(true);
      setExistingDesktopUrl(null); setExistingMobileUrl(null); setExistingVideoUrl(null);
    }
    setDesktopImage(null); setMobileImage(null); setVideoFile(null);
  }, [open, mode, banner]);

  // Object URL lifecycle management for Desktop Image
  useEffect(() => {
    if (desktopImage) {
      const url = URL.createObjectURL(desktopImage);
      setDesktopPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setDesktopPreviewUrl(null);
  }, [desktopImage]);

  // Object URL lifecycle management for Mobile Image
  useEffect(() => {
    if (mobileImage) {
      const url = URL.createObjectURL(mobileImage);
      setMobilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setMobilePreviewUrl(null);
  }, [mobileImage]);

  // Object URL lifecycle management for Video File
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setVideoPreviewUrl(null);
  }, [videoFile]);

  const handleSubmit = async () => {
    const newErrors: { name?: string; title?: string; desktopImage?: string; video?: string; schedule?: string; general?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Internal banner name is required';
    }
    if (!title.trim()) {
      newErrors.title = 'Banner title is required';
    }

    // Hero banner specific validations
    if (type === 'hero') {
      const hasDesktopImage = !!desktopImage || (!!existingDesktopUrl && !removeDesktopImage);
      if (!hasDesktopImage) {
        newErrors.desktopImage = 'Desktop background image is required for Hero banners';
      }
      if (videoFile || (existingVideoUrl && !removeVideo)) {
        newErrors.video = 'Hero banners cannot contain video. Please remove video before saving as Hero.';
      }
    }

    // File size validations
    if (desktopImage && desktopImage.size > 10 * 1024 * 1024) {
      newErrors.desktopImage = 'Desktop image size must be less than 10MB';
    }
    if (mobileImage && mobileImage.size > 10 * 1024 * 1024) {
      newErrors.general = 'Mobile image size must be less than 10MB';
    }
    if (videoFile && videoFile.size > 50 * 1024 * 1024) {
      newErrors.video = 'Video file size must be less than 50MB';
    }

    // Schedule validation
    if (scheduleEnabled) {
      if (!startDate) {
        newErrors.schedule = 'Start date is required when schedule is enabled';
      } else if (endDate && new Date(endDate) < new Date(startDate)) {
        newErrors.schedule = 'End date must be on or after start date';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('type', type);
      fd.append('name', name.trim());
      fd.append('title', title.trim());
      fd.append('subtitle', subtitle.trim());
      fd.append('altText', altText.trim());
      fd.append('ctaLabel', ctaLabel.trim());

      // Only send text ctaLink when no video file is uploaded or active
      if (!videoFile && !removeVideo && type !== 'hero') {
        fd.append('ctaLink', ctaLink.trim());
      } else if (type === 'hero') {
        fd.append('ctaLink', ctaLink.trim());
      }

      fd.append('enabled', String(enabled));
      fd.append('order', String(order));
      fd.append('scheduleEnabled', String(scheduleEnabled));
      fd.append('startDate', scheduleEnabled ? startDate : '');
      fd.append('startTime', scheduleEnabled ? startTime : '');
      fd.append('endDate', scheduleEnabled ? endDate : '');
      fd.append('endTime', scheduleEnabled ? endTime : '');

      if (desktopImage && cfg.showDesktopImage) {
        fd.append('desktopImage', desktopImage);
      } else if (removeDesktopImage) {
        fd.append('removeDesktopImage', 'true');
      }

      if (mobileImage && cfg.showMobileImage) {
        fd.append('mobileImage', mobileImage);
      } else if (removeMobileImage) {
        fd.append('removeMobileImage', 'true');
      }

      if (videoFile && cfg.showVideo) {
        fd.append('videoFile', videoFile);
      } else if (removeVideo || !cfg.showVideo) {
        fd.append('removeVideo', 'true');
      }

      await onSave(fd);
    } catch (e: any) {
      const errorMsg = String(e?.message || e || '');
      if (errorMsg.includes('413') || errorMsg.includes('FILE_TOO_LARGE') || errorMsg.includes('Payload Too Large')) {
        setErrors({ general: 'Uploaded file size is too large (HTTP 413). Maximum allowed size is 50MB for videos and 10MB for images.' });
      } else {
        setErrors({ general: errorMsg.replace(/^Error:\s*/, '') || 'Failed to save banner' });
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (hasError?: boolean): React.CSSProperties => ({
    background: 'var(--bg-card2)',
    border: `1px solid ${hasError ? 'var(--red, #ef4444)' : 'var(--border)'}`,
    color: 'var(--text-primary)',
    fontFamily: "'Open Sans', sans-serif",
    width: '100%',
    padding: '7px 11px',
    borderRadius: 8,
    fontSize: 12,
    outline: 'none',
    transition: 'border-color 0.15s, background 0.15s',
  });

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--orange)';
    e.currentTarget.style.background = '#fff';
  };
  const blurStyle = (hasError?: boolean) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = hasError ? 'var(--red, #ef4444)' : 'var(--border)';
    e.currentTarget.style.background = 'var(--bg-card2)';
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] transition-opacity duration-[250ms]"
        style={{ background: 'rgba(28,15,5,0.4)', opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }}
        onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col transition-transform duration-[300ms]"
        style={{
          width: 480, maxWidth: '100vw',
          background: 'var(--bg-card)',
          boxShadow: open ? '-12px 0 40px rgba(44,26,14,0.18)' : 'none',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center justify-center rounded-[10px] text-[18px]"
              style={{ width: 36, height: 36, background: TYPE_OPTIONS.find(t => t.key === type)?.bg || 'var(--orange-light)' }}>
              {TYPE_OPTIONS.find(t => t.key === type)?.emoji}
            </div>
            <div>
              <div className="font-display text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {mode === 'edit' ? 'Edit Banner' : 'New Banner'}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {mode === 'edit' && banner ? `Editing "${banner.name}"` : 'Fill in the fields below'}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{ width: 30, height: 30, background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { (e.currentTarget as any).style.background = 'var(--red-bg)'; (e.currentTarget as any).style.borderColor = 'var(--red)'; (e.currentTarget as any).style.color = 'var(--red)'; }}
            onMouseLeave={e => { (e.currentTarget as any).style.background = 'var(--bg-card2)'; (e.currentTarget as any).style.borderColor = 'var(--border)'; (e.currentTarget as any).style.color = 'var(--text-secondary)'; }}
          >
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 flex flex-col gap-0">

            {/* General Error Banner */}
            {errors.general && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                <span>{errors.general}</span>
              </div>
            )}

            {/* ── Banner Type ── */}
            <SectionTitle label="Banner type" />
            <div className="grid grid-cols-2 gap-2 mb-5">
              {TYPE_OPTIONS.map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleTypeChange(t.key)}
                  className="flex items-center gap-[9px] px-3 py-[9px] rounded-[10px] cursor-pointer transition-all text-left relative"
                  style={{
                    border: `1.5px solid ${type === t.key ? t.color : 'var(--border)'}`,
                    background: type === t.key ? t.bg : 'var(--bg-card2)',
                    boxShadow: type === t.key ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0 text-[15px]"
                    style={{ width: 30, height: 30, background: t.bg }}>
                    {t.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold flex items-center justify-between" style={{ color: type === t.key ? t.color : 'var(--text-secondary)' }}>
                      <span>{t.label}</span>
                      {type === t.key && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{t.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Internal Name ── */}
            <SectionTitle label="Identity" />
            <FieldBlock label="Internal name" required hint={cfg.nameHint} hintIcon error={errors.name}>
              <input
                style={getInputStyle(!!errors.name)}
                value={name}
                onChange={e => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                placeholder={cfg.namePlaceholder}
                onFocus={focusStyle}
                onBlur={blurStyle(!!errors.name)}
              />
            </FieldBlock>

            {/* ── Content Fields ── */}
            <SectionTitle label="Content" />

            <FieldBlock label={cfg.titleLabel} required error={errors.title}>
              <input
                style={getInputStyle(!!errors.title)}
                value={title}
                onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: undefined })); }}
                placeholder={cfg.titlePlaceholder}
                onFocus={focusStyle}
                onBlur={blurStyle(!!errors.title)}
              />
            </FieldBlock>

            <FieldBlock label={cfg.subtitleLabel} optional hint={cfg.subtitleHint}>
              <textarea
                value={subtitle} onChange={e => setSubtitle(e.target.value)}
                placeholder={cfg.subtitlePlaceholder}
                rows={3}
                className="w-full rounded-lg text-xs outline-none resize-none transition-colors"
                style={{ ...getInputStyle(), width: '100%', padding: '7px 11px' }}
                onFocus={focusStyle as any} onBlur={blurStyle() as any}
              />
            </FieldBlock>

            {/* ── CTA / Section-specific fields ── */}
            <SectionTitle label={cfg.showVideo ? 'Reel card details' : 'CTA / Action'} />

            <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
              <FieldBlock label={cfg.ctaLabelLabel} optional>
                <input style={getInputStyle()} value={ctaLabel} onChange={e => setCtaLabel(e.target.value)}
                  placeholder={cfg.ctaLabelPlaceholder} onFocus={focusStyle} onBlur={blurStyle()} />
              </FieldBlock>
              <FieldBlock label={cfg.ctaLinkLabel} optional hint={cfg.ctaLinkHint}>
                <input style={getInputStyle()} value={ctaLink} onChange={e => setCtaLink(e.target.value)}
                  placeholder={cfg.ctaLinkPlaceholder} onFocus={focusStyle} onBlur={blurStyle()} />
              </FieldBlock>
            </div>

            {/* ── SEO Alt Text ── */}
            {(cfg.showDesktopImage || cfg.showMobileImage) && (
              <FieldBlock label="Alt text" optional="for SEO">
                <input style={getInputStyle()} value={altText} onChange={e => setAltText(e.target.value)}
                  placeholder="Describe the banner image for screen readers / search engines"
                  onFocus={focusStyle} onBlur={blurStyle()} />
              </FieldBlock>
            )}

            {/* ── Media ── */}
            {(cfg.showDesktopImage || cfg.showMobileImage || cfg.showVideo) && (
              <>
                <SectionTitle label="Media" />

                {/* Video Upload — for reel / menu banners */}
                {cfg.showVideo && (
                  <FieldBlock label="Video file" optional="or enter a URL in the field above" error={errors.video}>
                    <input ref={videoRef} type="file" accept=".mp4,.webm,.mov" hidden
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 50 * 1024 * 1024) {
                            setErrors(prev => ({ ...prev, video: 'Video file size exceeds 50MB limit. Please select a smaller file.' }));
                            if (videoRef.current) videoRef.current.value = '';
                            return;
                          }
                          setVideoFile(file);
                          setRemoveVideo(false);
                          if (errors.video) setErrors(prev => ({ ...prev, video: undefined }));
                        }
                      }} />
                    
                    {/* Preview of uploaded or existing video */}
                    {(videoPreviewUrl || (existingVideoUrl && !removeVideo)) && (
                      <div className="mb-2 rounded-[10px] overflow-hidden relative" style={{ aspectRatio: '9/16', maxHeight: 200, background: '#111' }}>
                        <video
                          src={videoPreviewUrl || existingVideoUrl!}
                          className="w-full h-full object-cover"
                          muted autoPlay loop playsInline
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setRemoveVideo(true);
                            setExistingVideoUrl(null);
                            setCtaLink('');
                            if (videoRef.current) videoRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 flex items-center justify-center rounded-full text-white transition-all cursor-pointer"
                          style={{ width: 22, height: 22, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
                          title="Remove video"
                        >
                          <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                        <div className="absolute bottom-2 left-2 text-[9px] px-2 py-[2px] rounded-full font-bold" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                          {videoFile ? videoFile.name : 'Current video'}
                        </div>
                      </div>
                    )}

                    <UploadZone
                      label={videoFile ? `✓ ${videoFile.name}` : (existingVideoUrl && !removeVideo) ? 'Replace video file' : 'Click to upload video'}
                      hint="MP4, WebM, MOV · 9:16 vertical recommended · Max 50MB"
                      icon="video"
                      hasFile={!!(videoFile || (existingVideoUrl && !removeVideo))}
                      onClick={() => {
                        if (videoRef.current) videoRef.current.value = '';
                        videoRef.current?.click();
                      }}
                    />
                  </FieldBlock>
                )}

                {/* Desktop Image */}
                {cfg.showDesktopImage && (
                  <FieldBlock label={cfg.desktopImageLabel} required={type === 'hero'} error={errors.desktopImage}>
                    <input ref={desktopRef} type="file" accept="image/*" hidden
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            setErrors(prev => ({ ...prev, desktopImage: 'Desktop image size exceeds 10MB limit. Please select a smaller file.' }));
                            if (desktopRef.current) desktopRef.current.value = '';
                            return;
                          }
                          setDesktopImage(file);
                          setRemoveDesktopImage(false);
                          if (errors.desktopImage) setErrors(prev => ({ ...prev, desktopImage: undefined }));
                        }
                      }} />
                    
                    {/* Preview */}
                    {(desktopPreviewUrl || (existingDesktopUrl && !removeDesktopImage)) && (
                      <div className="mb-2 rounded-[10px] overflow-hidden relative" style={{ maxHeight: 140, background: '#111' }}>
                        <img
                          src={desktopPreviewUrl || existingDesktopUrl!}
                          alt="Desktop preview"
                          className="w-full object-cover rounded-[10px]"
                          style={{ maxHeight: 140 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setDesktopImage(null);
                            setRemoveDesktopImage(true);
                            setExistingDesktopUrl(null);
                            if (desktopRef.current) desktopRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 flex items-center justify-center rounded-full text-white cursor-pointer"
                          style={{ width: 22, height: 22, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
                          title="Remove image"
                        >
                          <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                    <UploadZone
                      label={desktopImage ? `✓ ${desktopImage.name}` : (existingDesktopUrl && !removeDesktopImage) ? 'Replace image' : 'Click to upload'}
                      hint={cfg.desktopImageHint}
                      icon="image"
                      hasFile={!!(desktopImage || (existingDesktopUrl && !removeDesktopImage))}
                      onClick={() => {
                        if (desktopRef.current) desktopRef.current.value = '';
                        desktopRef.current?.click();
                      }}
                    />
                  </FieldBlock>
                )}

                {/* Mobile Image */}
                {cfg.showMobileImage && (
                  <FieldBlock label={cfg.mobileImageLabel || 'Mobile image'} optional="optional — uses desktop if empty">
                    <input ref={mobileRef} type="file" accept="image/*" hidden
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            setErrors(prev => ({ ...prev, general: 'Mobile image size exceeds 10MB limit. Please select a smaller file.' }));
                            if (mobileRef.current) mobileRef.current.value = '';
                            return;
                          }
                          setMobileImage(file);
                          setRemoveMobileImage(false);
                        }
                      }} />
                    
                    {(mobilePreviewUrl || (existingMobileUrl && !removeMobileImage)) && (
                      <div className="mb-2 rounded-[10px] overflow-hidden relative" style={{ maxHeight: 120, background: '#111' }}>
                        <img
                          src={mobilePreviewUrl || existingMobileUrl!}
                          alt="Mobile preview"
                          className="w-full object-cover rounded-[10px]"
                          style={{ maxHeight: 120 }}
                        />
                        <button
                          onClick={() => {
                            setMobileImage(null);
                            setRemoveMobileImage(true);
                            setExistingMobileUrl(null);
                            if (mobileRef.current) mobileRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 flex items-center justify-center rounded-full text-white cursor-pointer"
                          style={{ width: 22, height: 22, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
                          title="Remove mobile image"
                        >
                          <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                    <UploadZone
                      label={mobileImage ? `✓ ${mobileImage.name}` : (existingMobileUrl && !removeMobileImage) ? 'Replace mobile image' : 'Click to upload mobile image'}
                      hint={cfg.mobileImageHint || 'PNG, JPG, WebP · 768×500px · Max 5MB'}
                      icon="mobile"
                      hasFile={!!(mobileImage || (existingMobileUrl && !removeMobileImage))}
                      onClick={() => {
                        if (mobileRef.current) mobileRef.current.value = '';
                        mobileRef.current?.click();
                      }}
                    />
                    <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Shown on screens under 768px. Upload for best mobile appearance.
                    </div>
                  </FieldBlock>
                )}
              </>
            )}

            {/* ── Display Order ── */}
            <SectionTitle label="Display order" />
            <FieldBlock label="Order position">
              <div className="flex items-center gap-3">
                <input type="number" min={1} value={order} onChange={e => setOrder(Number(e.target.value))}
                  style={{ ...getInputStyle(), width: 100 }} onFocus={focusStyle} onBlur={blurStyle()} />
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Lower = shown first</span>
              </div>
            </FieldBlock>

            {/* ── Schedule ── */}
            <SectionTitle label="Schedule" />
            <div className="flex items-center justify-between px-3 py-[10px] rounded-lg mb-[10px]"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Set a schedule</div>
                <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Control when this banner goes live and expires</div>
              </div>
              <div onClick={() => {
                setScheduleEnabled(!scheduleEnabled);
                if (errors.schedule) setErrors(prev => ({ ...prev, schedule: undefined }));
              }}
                className="relative cursor-pointer flex-shrink-0 rounded-[10px] transition-colors duration-200"
                style={{ width: 36, height: 20, background: scheduleEnabled ? 'var(--orange)' : '#D0C4B8' }}>
                <span className="absolute top-[2px] rounded-full transition-all duration-200"
                  style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', right: scheduleEnabled ? 2 : 18 }} />
              </div>
            </div>

            {errors.schedule && (
              <div className="mb-3 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                <span>{errors.schedule}</span>
              </div>
            )}

            <div style={{ opacity: scheduleEnabled ? 1 : 0.4, pointerEvents: scheduleEnabled ? 'all' : 'none' }}>
              <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
                <div>
                  <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                    Start date <span style={{ color: 'var(--orange)' }}>*</span>
                  </label>
                  <input type="date" value={startDate} onChange={e => {
                    setStartDate(e.target.value);
                    if (errors.schedule) setErrors(prev => ({ ...prev, schedule: undefined }));
                  }}
                    style={getInputStyle(!!errors.schedule)} onFocus={focusStyle} onBlur={blurStyle(!!errors.schedule)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>Start time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                    style={getInputStyle()} onFocus={focusStyle} onBlur={blurStyle()} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
                <div>
                  <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                    End date <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span>
                  </label>
                  <input type="date" value={endDate} onChange={e => {
                    setEndDate(e.target.value);
                    if (errors.schedule) setErrors(prev => ({ ...prev, schedule: undefined }));
                  }}
                    style={getInputStyle(!!errors.schedule)} onFocus={focusStyle} onBlur={blurStyle(!!errors.schedule)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold mb-[5px] block" style={{ color: 'var(--text-primary)' }}>End time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    style={getInputStyle()} onFocus={focusStyle} onBlur={blurStyle()} />
                </div>
              </div>
              <div className="flex items-start gap-[7px] px-3 py-[9px] rounded-lg mb-[10px]"
                style={{ background: 'var(--orange-light)', border: '1px solid rgba(212,114,42,0.2)', color: 'var(--orange)', fontSize: 11 }}>
                <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] flex-shrink-0 mt-[1px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                Auto goes live at start time and hides after end date — no manual action needed.
              </div>
            </div>

            {/* ── Visibility ── */}
            <SectionTitle label="Visibility" />
            <div className="flex items-center justify-between px-[13px] py-[11px] rounded-lg mb-4"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Enable banner</div>
                <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
                  When off, hidden from website regardless of schedule
                </div>
              </div>
              <div onClick={() => setEnabled(!enabled)}
                className="relative cursor-pointer flex-shrink-0 rounded-[11px] transition-colors duration-200"
                style={{ width: 40, height: 22, background: enabled ? 'var(--orange)' : '#D0C4B8' }}>
                <span className="absolute top-[3px] rounded-full transition-all duration-200"
                  style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', right: enabled ? 3 : 21 }} />
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-[10px] px-5 py-[14px] flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-[9px] rounded-lg text-[13px] cursor-pointer transition-all disabled:opacity-50"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}
            onMouseEnter={e => { (e.currentTarget as any).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as any).style.background = 'var(--bg-card2)'; }}
          >
            Cancel
          </button>
          <button onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-[9px] rounded-lg text-[13px] font-bold cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'var(--orange)', border: 'none', color: '#fff', fontFamily: "'Open Sans', sans-serif", boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as any).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as any).style.background = 'var(--orange)'; }}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" />
              </svg>
            )}
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Save banner'}
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Helper Components ─── */

const SectionTitle: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-[6px] text-[10px] font-bold uppercase tracking-[.1em] mb-[10px] pb-[6px] mt-5 first:mt-0"
    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
    {label}
  </div>
);

const FieldBlock: React.FC<{
  label: string;
  required?: boolean;
  optional?: string | boolean;
  hint?: string;
  hintIcon?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, optional, hint, hintIcon, error, children }) => (
  <div className="mb-[13px]">
    <label className="text-[11px] font-semibold flex items-center gap-1 mb-[5px]" style={{ color: error ? 'var(--red, #ef4444)' : 'var(--text-primary)' }}>
      {label}
      {required && <span style={{ color: 'var(--orange)' }}>*</span>}
      {optional && <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>{typeof optional === 'string' ? optional : 'optional'}</span>}
    </label>
    {children}
    {error && (
      <div className="text-[10px] font-medium text-red-500 mt-[4px] flex items-center gap-1">
        <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
        <span>{error}</span>
      </div>
    )}
    {hint && !error && (
      <div className="flex items-start gap-[5px] mt-[5px] px-2 py-[5px] rounded-[6px]"
        style={{ background: 'rgba(212,114,42,0.06)', border: '1px solid rgba(212,114,42,0.12)' }}>
        {hintIcon && (
          <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] flex-shrink-0 mt-[1px]" fill="none" stroke="var(--orange)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        )}
        <span className="text-[10px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{hint}</span>
      </div>
    )}
  </div>
);

const UploadZone: React.FC<{
  label: string;
  hint: string;
  icon: 'image' | 'mobile' | 'video';
  hasFile: boolean;
  onClick: () => void;
}> = ({ label, hint, icon, hasFile, onClick }) => (
  <div
    onClick={onClick}
    className="w-full flex flex-col items-center gap-[6px] rounded-[10px] p-4 cursor-pointer transition-all text-center"
    style={{
      background: hasFile ? 'rgba(212,114,42,0.05)' : 'var(--bg-card2)',
      border: `2px dashed ${hasFile ? 'var(--orange)' : 'var(--border-strong)'}`,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
      (e.currentTarget as HTMLElement).style.background = 'rgba(212,114,42,0.06)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = hasFile ? 'var(--orange)' : 'var(--border-strong)';
      (e.currentTarget as HTMLElement).style.background = hasFile ? 'rgba(212,114,42,0.05)' : 'var(--bg-card2)';
    }}
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      style={{ color: hasFile ? 'var(--orange)' : 'var(--text-muted)' }}>
      {icon === 'video' ? (
        <><rect x="2" y="2" width="20" height="20" rx="2.18" /><polygon points="10 8 16 12 10 16 10 8" /></>
      ) : icon === 'mobile' ? (
        <><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="1" /></>
      ) : (
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      )}
    </svg>
    <span className="text-xs font-medium" style={{ color: hasFile ? 'var(--orange)' : 'var(--text-muted)' }}>{label}</span>
    <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{hint}</small>
  </div>
);
