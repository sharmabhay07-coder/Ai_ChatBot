import React from 'react';
import icon from '../assets/assistance.mp4';

export default function Typing() {
  return (
    <div className="row bot">
      <div className="bot-avatar">
        <video src={icon} className="icon-video" autoPlay muted loop />
      </div>
      <div className="bubble typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}