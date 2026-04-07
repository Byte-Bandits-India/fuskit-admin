import React, { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { useToggle } from '@/hooks/useToggle';
import { Modal, Input, Button } from 'antd';

export const AnnouncementBanner: React.FC = () => {
  const { on, toggle } = useToggle(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState("Now open in Bangalore! Visit us on ECR, Chennai — Open everyday");
  const [inputValue, setInputValue] = useState(announcementText);

  const showModal = () => {
    setInputValue(announcementText);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setAnnouncementText(inputValue);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <div className="flex-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Announcement bar</strong>
          {' '}— "{announcementText}"
        </div>
        <span 
          className="text-[11px] font-semibold cursor-pointer mr-3 transition-opacity hover:opacity-70" 
          style={{ color: 'var(--orange)' }}
          onClick={showModal}
        >
          Edit text
        </span>
        <Toggle on={on} onToggle={toggle} />
      </div>

      <Modal
        title="Edit Announcement Bar Text"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleOk}
            style={{ background: 'var(--orange)', borderColor: 'var(--orange)' }}
          >
            Processed
          </Button>,
        ]}
      >
        <div className="py-4">
          <Input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter announcement text" 
            size="large"
          />
        </div>
      </Modal>
    </>
  );
};
