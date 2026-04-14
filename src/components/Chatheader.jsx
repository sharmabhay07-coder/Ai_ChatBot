import React from 'react';
import icon from '../assets/assistance.mp4';

export default function Chatheader({ theme, onTogglesidebar, onToggletheme }) {
  return (
    <div className="chat-header">
      {/* <button className="menu-btn" onClick={onTogglesidebar}>☰</button> */}
      <div className="avatar">
        <video src={icon} className="icon-video" autoPlay muted loop />
      </div>
      <div className="header-info">
        <span className="header-name">Hasty</span>
        <span className="header-status">
          <span className="status-dot" />
          Online
        </span>
      </div>
      <button className="theme-btn" onClick={onToggletheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}