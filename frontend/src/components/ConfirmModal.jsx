import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button className="pixel-button" onClick={onConfirm}>
            Yes
          </button>
          <button className="pixel-button accent" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;