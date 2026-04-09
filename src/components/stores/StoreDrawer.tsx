import React, { useState, useEffect } from 'react';
import type { StoreDTO, StoreHoursDTO } from '@/services/api';

export type ExclusiveItem = StoreDTO['exclusiveItems'][0];
export type Store = StoreDTO;

interface StoreDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  store: Store | null;
  onClose: () => void;
  onSave: (data: Partial<Store>) => void;
  onGalleryUpload?: (file: File) => Promise<void>;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const DEFAULT_HOURS: Record<string, StoreHoursDTO> = Object.fromEntries(
  DAYS.map(d => [d, { open: '10am', close: '11pm', closed: false }])
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-card2)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  fontFamily: "'Open Sans', sans-serif",
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors ${props.className ?? ''}`}
    style={inputStyle}
    onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors ${props.className ?? ''}`}
    style={inputStyle}
    onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.background = '#fff'; }}
    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card2)'; }}
  />
);

const SectionTitle: React.FC<{ emoji: string; label: string }> = ({ emoji, label }) => (
  <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]"
    style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
    <span style={{ color: 'var(--orange)' }}>{emoji}</span> {label}
  </h3>
);

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
    {children}{required && <span style={{ color: 'var(--orange)' }}>*</span>}
  </label>
);

const Field: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`mb-[13px] ${className ?? ''}`}>{children}</div>
);

export const StoreDrawer: React.FC<StoreDrawerProps> = ({ open, mode, store, onClose, onSave, onGalleryUpload }) => {
  /* ── controlled state ── */
  const drawerFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [mapsEmbed, setMapsEmbed] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [hours, setHours] = useState<Record<string, StoreHoursDTO>>(DEFAULT_HOURS);
  const [enabled, setEnabled] = useState(true);
  const [rating, setRating] = useState('');
  const [reviewCount, setReviewCount] = useState('');
  const [foundedYear, setFoundedYear] = useState('');

  /* Populate form when opening in edit mode */
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && store) {
        setName(store.name ?? '');
        setCity(store.city ?? '');
        setState(store.state ?? '');
        setAddress(store.address ?? '');
        setPhone(store.phone ?? '');
        setWhatsapp(store.whatsapp ?? '');
        setEmail(store.email ?? '');
        setMapsLink(store.mapsLink ?? '');
        setMapsEmbed(store.mapsEmbed ?? '');
        setManagerName(store.managerName ?? '');
        setManagerPhone(store.managerPhone ?? '');
        setHours(store.hours && Object.keys(store.hours).length > 0 ? store.hours : DEFAULT_HOURS);
        setEnabled(store.enabled ?? true);
        setRating(store.rating != null ? String(store.rating) : '');
        setReviewCount(store.reviewCount != null ? String(store.reviewCount) : '');
        setFoundedYear(store.foundedYear != null ? String(store.foundedYear) : '');
      } else {
        setName(''); setCity(''); setState(''); setAddress('');
        setPhone(''); setWhatsapp(''); setEmail('');
        setMapsLink(''); setMapsEmbed('');
        setManagerName(''); setManagerPhone('');
        setHours(DEFAULT_HOURS);
        setEnabled(true);
        setRating(''); setReviewCount(''); setFoundedYear('');
      }
    }
  }, [open, mode, store]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onGalleryUpload) return;
    setIsUploadingPhoto(true);
    await onGalleryUpload(file);
    setIsUploadingPhoto(false);
    e.target.value = '';
  };

  const updateHours = (day: string, field: keyof StoreHoursDTO, value: string | boolean) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = () => {
    const payload: Partial<Store> = {
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || undefined,
      email: email.trim() || undefined,
      mapsLink: mapsLink.trim(),
      mapsEmbed: mapsEmbed.trim() || undefined,
      managerName: managerName.trim() || undefined,
      managerPhone: managerPhone.trim() || undefined,
      hours,
      enabled,
      rating: rating ? parseFloat(rating) : undefined,
      reviewCount: reviewCount ? parseInt(reviewCount, 10) : undefined,
      foundedYear: foundedYear ? parseInt(foundedYear, 10) : undefined,
    };
    onSave(payload);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#1C0F05]/35 z-[100] transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] z-[101] flex flex-col shadow-[-8px_0_32px_rgba(44,26,14,0.14)]"
        style={{ background: 'var(--bg-card)', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) both' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {mode === 'edit' ? 'Edit Store' : 'Add Store'}
            </h2>
            <p className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>
              {mode === 'edit' ? `Editing "${store?.name}"` : 'Fill in all store details below'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-[30px] h-[30px] rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--red-bg)'; el.style.borderColor = 'var(--red)'; el.style.color = 'var(--red)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--bg-card2)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}>
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-[18px]">

          {/* ── Store Info ── */}
          <div className="mb-5">
            <SectionTitle emoji="🏠" label="Store Info" />
            <Field>
              <Label required>Store name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chennai — ECR, Akkarai" />
            </Field>
            <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
              <div>
                <Label required>City</Label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Chennai" />
              </div>
              <div>
                <Label required>State / Country</Label>
                <Input value={state} onChange={e => setState(e.target.value)} placeholder="e.g. Tamil Nadu, India" />
              </div>
            </div>
            <Field>
              <Label required>Full address</Label>
              <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Sea Cliff Conclave..." className="min-h-[64px]" />
            </Field>
          </div>

          {/* ── Contact ── */}
          <div className="mb-5">
            <SectionTitle emoji="📞" label="Contact" />
            <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
              <div>
                <Label required>Phone</Label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label>WhatsApp number</Label>
                <Input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
            <Field>
              <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                Store email <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span>
              </label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="chennai@fusk-it.com" />
            </Field>
            <Field>
              <Label required>Google Maps link</Label>
              <Input type="url" value={mapsLink} onChange={e => setMapsLink(e.target.value)} placeholder="https://maps.google.com/..." />
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Paste the share link from Google Maps.</div>
            </Field>
            <Field>
              <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                Google Maps embed code <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span>
              </label>
              <Textarea value={mapsEmbed} onChange={e => setMapsEmbed(e.target.value)}
                placeholder="<iframe src='...'></iframe>" className="min-h-[80px]"
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 11 }} />
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Get this from Google Maps → Share → Embed a map → Copy HTML.</div>
            </Field>
          </div>

          {/* ── Store Manager ── */}
          <div className="mb-5">
            <SectionTitle emoji="👤" label="Store Manager" />
            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <Label>Manager name</Label>
                <Input value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="e.g. Sheriff Ahmed" />
              </div>
              <div>
                <Label>Manager phone</Label>
                <Input type="tel" value={managerPhone} onChange={e => setManagerPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>

          {/* ── Opening Hours ── */}
          <div className="mb-5">
            <SectionTitle emoji="🕐" label="Opening Hours" />
            <div className="flex flex-col gap-[6px]">
              {DAYS.map(day => {
                const h = hours[day] ?? { open: '10am', close: '11pm', closed: false };
                return (
                  <div key={day} className="flex items-center gap-2 px-3 py-[8px] rounded-lg"
                    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
                    <div className="text-[11px] font-semibold w-8 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{day}</div>
                    <label className="flex items-center gap-[6px] cursor-pointer text-[11px] flex-shrink-0" style={{ color: h.closed ? 'var(--red)' : 'var(--green)' }}>
                      <input type="checkbox" checked={h.closed} onChange={e => updateHours(day, 'closed', e.target.checked)} className="accent-orange-500" />
                      Closed
                    </label>
                    {!h.closed && (
                      <>
                        <Input value={h.open} onChange={e => updateHours(day, 'open', e.target.value)}
                          placeholder="10am" className="flex-1 px-2 py-1 text-[11px]" style={{ ...inputStyle, padding: '4px 8px', fontSize: 11 }} />
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>–</span>
                        <Input value={h.close} onChange={e => updateHours(day, 'close', e.target.value)}
                          placeholder="11pm" className="flex-1 px-2 py-1 text-[11px]" style={{ ...inputStyle, padding: '4px 8px', fontSize: 11 }} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Visibility ── */}
          <div className="mb-5">
            <SectionTitle emoji="🌐" label="Visibility" />
            <div className="flex items-center justify-between px-3 py-[10px] rounded-lg"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Show on website</div>
                <div className="text-[10px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>Customers can see this store on the store locator</div>
              </div>
              <div onClick={() => setEnabled(!enabled)} className="relative cursor-pointer flex-shrink-0 rounded-[10px] transition-colors duration-200"
                style={{ width: 36, height: 20, background: enabled ? 'var(--orange)' : '#D0C4B8' }}>
                <span className="absolute top-[2px] rounded-full transition-all duration-200"
                  style={{ width: 16, height: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', right: enabled ? 2 : 18 }} />
              </div>
            </div>
          </div>

          {/* ── Extra Details ── */}
          <div className="mb-5">
            <SectionTitle emoji="📊" label="Extra Details" />
            <div className="grid grid-cols-3 gap-[10px]">
              <div>
                <Label>Rating</Label>
                <Input type="number" min="0" max="5" step="0.1" value={rating} onChange={e => setRating(e.target.value)} placeholder="4.5" />
              </div>
              <div>
                <Label>Reviews</Label>
                <Input type="number" min="0" value={reviewCount} onChange={e => setReviewCount(e.target.value)} placeholder="488" />
              </div>
              <div>
                <Label>Founded year</Label>
                <Input type="number" min="1900" max="2100" value={foundedYear} onChange={e => setFoundedYear(e.target.value)} placeholder="2004" />
              </div>
            </div>
          </div>

          {/* ── Store Images placeholder ── */}
          <div className="mb-5">
            <SectionTitle emoji="🖼️" label="Store Images" />
            <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" ref={drawerFileInputRef} onChange={handleFileChange} />
            <div className={`border-2 border-dashed rounded-[10px] p-[14px] flex flex-col items-center gap-[5px] text-center ${mode === 'edit' ? 'cursor-pointer transition-all' : ''}`}
              style={{ borderColor: mode === 'edit' ? 'var(--border-strong)' : 'var(--border)', background: 'var(--bg-card2)' }}
              onClick={mode === 'edit' && !isUploadingPhoto ? () => drawerFileInputRef.current?.click() : undefined}
              onMouseEnter={e => { if (mode === 'edit' && !isUploadingPhoto) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; } }}
              onMouseLeave={e => { if (mode === 'edit' && !isUploadingPhoto) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; } }}>
              <span className="text-[22px]">📸</span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {isUploadingPhoto ? 'Uploading photo...' : mode === 'add' ? 'Save this store first to unlock photo uploads.' : 'Click here to instantly upload a new store photo.'}
              </span>
              <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>PNG, JPG · Max 5MB</small>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-[14px] border-t flex gap-[10px] flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="px-4 py-[10px] rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={handleSave}
            disabled={!name.trim() || !city.trim() || !address.trim() || !phone.trim() || !mapsLink.trim()}
            className="flex-1 py-[10px] rounded-lg text-[13px] font-bold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--orange)', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}>
            {mode === 'edit' ? 'Save changes' : 'Save store'}
          </button>
        </div>
      </div>
    </>
  );
};
