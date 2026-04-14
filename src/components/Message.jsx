import React from 'react';
import icon from '../assets/assistance.mp4';

export default function Message({ message, messageIndex, onDelete }) {

    const copyMessage = (text) => {
        navigator.clipboard.writeText(text);
        alert('Message copied!');
    };

    return (
        <div className={`row ${message.role}`}>
            {message.role === 'bot' && (
                <div className="bot-avatar">
                    <video src={icon} className="icon-video" autoPlay muted loop />
                </div>
            )}
            <div className={`bubble ${message.error ? 'error' : ''}`}>
                <p>{message.text}</p>
                <span className="time">{message.time}</span>
                <div className="message-actions">
                    <button
                        className="action-btn"
                        onClick={() => copyMessage(message.text)}
                        title="Copy"
                    >
                        🗐
                    </button>
                </div>
            </div>
        </div>
    );
}