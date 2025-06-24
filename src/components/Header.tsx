import React from 'react';

const Header: React.FC = () => {

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4"
      style={{
        background: "var(--bg)",
        boxShadow: "var(--header-shadow)",
      }}
    >
      <div
        className="font-dela-gothic text-2xl tracking-wide"
        style={{ color: "var(--text)" }}
      >
        Threadr
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: "var(--bg-light)" }}
        >
          <img src="../profile.png" className="w-10 h-10 rounded-full" alt="User Profile" />
        </div>
      </div>
    </header>
  );
};

export default Header;

