import React, { useState, useEffect } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { Modal, Input, Button } from 'antd';
import { announcementsApi, type AnnouncementDTO } from '@/services/api';

const DEFAULT_ITEMS = [
  "FRESH OUT OF THE FRYER",
  "YOUR CITY NEEDS A FUSK-IT",
  "KADAK CHAI, ALWAYS",
  "VEG & NON-VEG SNACKS",
  "LATE NIGHT? WE'RE UP",
];

export const AnnouncementBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsList, setItemsList] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    announcementsApi.list()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setAnnouncement(res.data[0]);
        }
      }).catch(console.error);
  }, []);

  const handleToggle = async () => {
    if (!announcement) return;
    const newEnabled = !announcement.enabled;
    setAnnouncement({ ...announcement, enabled: newEnabled });
    try {
      await announcementsApi.update(announcement.id, { enabled: newEnabled });
    } catch(e) {
      setAnnouncement({ ...announcement, enabled: !newEnabled });
      console.error(e);
    }
  };

  const showModal = () => {
    const rawText = announcement?.text || "";
    const parsed = rawText
      .split(/\||\n/)
      .map(s => s.trim())
      .filter(Boolean);

    setItemsList(parsed.length > 0 ? parsed : DEFAULT_ITEMS);
    setIsModalOpen(true);
  };

  const handleItemChange = (index: number, value: string) => {
    const updated = [...itemsList];
    updated[index] = value;
    setItemsList(updated);
  };

  const handleAddItem = () => {
    setItemsList([...itemsList, ""]);
  };

  const handleDeleteItem = (index: number) => {
    if (itemsList.length <= 1) {
      setItemsList([""]);
    } else {
      setItemsList(itemsList.filter((_, i) => i !== index));
    }
  };

  const handleOk = async () => {
    setSaving(true);
    // Filter out empty items and join with " | "
    const validItems = itemsList.map(s => s.trim()).filter(Boolean);
    const joinedText = validItems.join(" | ");

    try {
      if (announcement) {
        const res = await announcementsApi.update(announcement.id, { text: joinedText });
        setAnnouncement(res.data);
      } else {
        const res = await announcementsApi.create({ text: joinedText, enabled: true });
        setAnnouncement(res.data);
      }
      setIsModalOpen(false);
    } catch(e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const displayItems = (announcement?.text || "")
    .split(/\||\n/)
    .map(s => s.trim())
    .filter(Boolean);

  const previewItems = itemsList.map(s => s.trim()).filter(Boolean);

  return (
    <>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-[10px]"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--orange)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--orange)' }}>
          <path d="M22 8.5c0-2.5-1.5-4-4-4H6C3.5 4.5 2 6 2 8.5v7c0 2.5 1.5 4 4 4h12c2.5 0 4-1.5 4-4v-7z" />
          <path d="M7 9l5 3.5L17 9" />
        </svg>
        <div className="flex-1 text-xs min-w-0" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Announcement / Marquee Ticker</strong>
          {' '}—{' '}
          {displayItems.length > 0 ? (
            <span className="inline-flex flex-wrap gap-1 items-center align-middle">
              {displayItems.slice(0, 4).map((item, idx) => (
                <span key={idx} className="px-2 py-[2px] rounded text-[10px] font-bold" style={{ background: 'var(--orange-light)', color: 'var(--orange)' }}>
                  {item}
                </span>
              ))}
              {displayItems.length > 4 && (
                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                  +{displayItems.length - 4} more
                </span>
              )}
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>No ticker items set</span>
          )}
        </div>
        <span 
          className="text-[11px] font-semibold cursor-pointer mr-3 transition-opacity hover:opacity-70 flex-shrink-0" 
          style={{ color: 'var(--orange)' }}
          onClick={showModal}
        >
          Edit items →
        </span>
        <Toggle on={announcement?.enabled ?? false} onToggle={handleToggle} />
      </div>

      <Modal
        title="Edit Marquee Ticker Items"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        width={600}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={saving}
            onClick={handleOk}
            style={{ background: 'var(--orange)', borderColor: 'var(--orange)' }}
          >
            Save Changes
          </Button>,
        ]}
      >
        <div className="py-3 flex flex-col gap-4">
          <div className="text-xs text-gray-500">
            Add or edit ticker text messages. Each item appears sequentially on the homepage marquee ticker bar.
          </div>

          {/* List of text boxes */}
          <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {itemsList.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-12 flex-shrink-0">
                  #{index + 1}
                </span>
                <Input
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`e.g. Ticker text #${index + 1}`}
                  size="middle"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteItem(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer border border-transparent hover:border-red-200"
                  title="Delete item"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add item button */}
          <Button
            type="dashed"
            onClick={handleAddItem}
            block
            className="flex items-center justify-center gap-1.5 font-semibold text-orange-600 border-orange-300 hover:text-orange-700 hover:border-orange-400"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add ticker item
          </Button>

          {/* Live Marquee Preview */}
          {previewItems.length > 0 && (
            <div className="mt-2 p-3 rounded-xl border border-orange-200 bg-orange-50/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-2">
                Live Marquee Ticker Preview ({previewItems.length} active items)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {previewItems.map((text, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold bg-white text-orange-600 shadow-sm border border-orange-200">
                    <span>{text}</span>
                    <span className="text-orange-400 text-[10px]">✦</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
