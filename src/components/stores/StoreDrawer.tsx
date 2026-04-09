import React from 'react';

import type { StoreDTO } from '@/services/api';

export type ExclusiveItem = StoreDTO['exclusiveItems'][0];
export type Store = StoreDTO;

interface StoreDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  store: Store | null;
  onClose: () => void;
  onSave: (data: Partial<Store>) => void;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const StoreDrawer: React.FC<StoreDrawerProps> = ({ open, mode, store, onClose, onSave }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#1C0F05]/35 z-[100] transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] z-[101] flex flex-col shadow-[-8px_0_32px_rgba(44,26,14,0.14)]"
        style={{ background: 'var(--bg-card)', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>{mode === 'edit' ? 'Edit Store' : 'Add Store'}</h2>
            <p className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{mode === 'edit' ? `Editing "${store?.name}"` : 'Fill in all store details below'}</p>
          </div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-[18px]">
          
          {/* Basic Info */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>🏠</span> Store Info
            </h3>
            <div className="mb-[13px]">
              <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>Store name <span className="text-[var(--orange)]">*</span></label>
              <input type="text" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.name} placeholder="e.g. Chennai — ECR, Akkarai"
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
            </div>
            <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
              <div>
                <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>City <span className="text-[var(--orange)]">*</span></label>
                <input type="text" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.city} placeholder="e.g. Chennai"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>State / Country <span className="text-[var(--orange)]">*</span></label>
                <input type="text" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.state} placeholder="e.g. Tamil Nadu, India"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
            </div>
            <div className="mb-[13px]">
              <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>Full address <span className="text-[var(--orange)]">*</span></label>
              <textarea className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors min-h-[64px]" defaultValue={store?.address} placeholder="Sea Cliff Conclave..."
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
            </div>
          </div>

          {/* Contact */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>📞</span> Contact
            </h3>
            <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
              <div>
                <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>Phone <span className="text-[var(--orange)]">*</span></label>
                <input type="tel" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.phone} placeholder="+91 98765 43210"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>WhatsApp number</label>
                <input type="tel" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.whatsapp} placeholder="+91 98765 43210"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
            </div>
            <div className="mb-[13px]">
              <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Store email <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span></label>
              <input type="email" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.email} placeholder="chennai@fusk-it.com"
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
            </div>
            <div className="mb-[13px]">
              <label className="block text-[11px] font-semibold mb-[5px] flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>Google Maps link <span className="text-[var(--orange)]">*</span></label>
              <input type="url" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.mapsLink} placeholder="https://maps.google.com/..."
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Paste the share link from Google Maps.</div>
            </div>
            <div className="mb-[13px]">
              <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Google Maps embed code <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>optional</span></label>
              <textarea className="w-full px-[11px] py-2 rounded-lg outline-none transition-colors min-h-[80px]" defaultValue={store?.mapsEmbed} placeholder="<iframe src='...'></iframe>"
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "monospace", fontSize: 11 }} />
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Get this from Google Maps → Share → Embed a map → Copy HTML.</div>
            </div>
          </div>

          <div className="mb-[13px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>👤</span> Store Manager
            </h3>
            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Manager name</label>
                <input type="text" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.managerName} placeholder="e.g. Sheriff Ahmed"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Manager phone</label>
                <input type="tel" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={store?.managerPhone} placeholder="+91 98765 43210"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
            </div>
          </div>
          
          {/* Images Placeholder */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>🖼️</span> Store Images
            </h3>
            <div className="border-2 border-dashed rounded-[10px] p-[14px] flex flex-col items-center gap-[5px] cursor-pointer transition-all text-center"
              style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-card2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}>
              <span className="text-[22px]">📸</span>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Upload store photos</span>
              <small className="text-[10px]" style={{ color: 'var(--text-muted)' }}>PNG, JPG · Up to 8 photos · Max 5MB each</small>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-[14px] border-t flex gap-[10px] flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="px-4 py-[10px] rounded-lg text-[13px] font-semibold transition-all"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={() => { onSave({}); onClose(); }} className="flex-1 py-[10px] rounded-lg text-[13px] font-bold text-white transition-all"
            style={{ background: 'var(--orange)', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}>
            {mode === 'edit' ? 'Save changes' : 'Save store'}
          </button>
        </div>
      </div>
    </>
  );
};
