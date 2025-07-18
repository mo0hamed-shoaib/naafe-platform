import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

interface NotificationBellProps {
  unreadCount: number;
  notifications: NotificationItem[];
  onOpen?: () => void;
  onClose?: () => void;
}

export interface NotificationItem {
  _id: string;
  type: string;
  message: string;
  relatedChatId?: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount, notifications, onOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && onOpen) onOpen();
    if (!open && onClose) onClose();
  }, [open, onOpen, onClose]);

  // Close dropdown on outside click only
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Don't close if clicking on the bell button
      if (bellRef.current && bellRef.current.contains(target)) {
        return;
      }
      
      // Don't close if clicking inside the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }
      
      // Close if clicking outside both
      setOpen(false);
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
  };

  const handleDropdownClose = () => {
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="الإشعارات"
        onClick={handleBellClick}
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
        )}
      </button>
      
      {open && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <NotificationDropdown 
            notifications={notifications} 
            onClose={handleDropdownClose}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 