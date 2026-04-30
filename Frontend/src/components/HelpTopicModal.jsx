import React from 'react';
import './HelpTopicModal.css';

const HelpTopicModal = ({ open, onClose, title, content }) => {
  if (!open) return null;
  return (
    <div className="help-modal-backdrop" onClick={onClose}>
      <div className="help-modal" onClick={e => e.stopPropagation()}>
        <button className="help-modal-close" onClick={onClose}>&times;</button>
        <h2 className="help-modal-title">{title}</h2>
        <div className="help-modal-content">{content}</div>
      </div>
    </div>
  );
};

export default HelpTopicModal; 