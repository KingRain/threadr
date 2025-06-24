import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onClearData }) => {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      onClearData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div 
        className="rounded-lg p-6 w-full max-w-md"
        style={{
          background: 'var(--background)',
          color: 'var(--text)',
          border: '1px solid var(--border)'
        }}
      >
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        
        {/* Theme Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Theme</span>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--secondary)',
              }}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {theme === 'dark' ? 'Dark' : 'Light'} mode
          </p>
        </div>

        {/* Danger Zone */}
        <div 
          className="p-4 rounded-lg mb-6"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--bg-light)'
          }}
        >
          <h3 className="font-medium mb-2" style={{ color: 'var(--danger)' }}>Danger Zone</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            Clear all local data including preferences and cached content.
          </p>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-md transition-colors text-sm"
            style={{
              backgroundColor: 'var(--danger)',
              color: 'white'
            }}
          >
            Clear Local Data
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: '1px solid var(--border)'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
