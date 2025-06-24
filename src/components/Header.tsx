import React, { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import SettingsModal from './SettingsModal';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleClearLocalData = () => {
    localStorage.clear();
    alert('Local data has been cleared. The page will now refresh.');
    window.location.reload();
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4"
      style={{
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      }}
    >
      <h1 className="font-dela-gothic text-2xl tracking-wide">
        Threadr
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 rounded-full transition-colors ${isDark ? 'bg-opacity-10 hover:bg-opacity-20' : 'bg-opacity-5 hover:bg-opacity-10'}`}
          aria-label="Settings"
        >
          <Cog6ToothIcon 
            className="w-6 h-6"
            style={{ 
              color: isDark ? 'var(--text)' : 'var(--text)' 
            }} 
          />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src="/profile.png" alt="User" className="w-full h-full" />
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearData={handleClearLocalData}
      />
    </header>
  );
};

export default Header;

