import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info', // info, confirm, success, error
  confirmText = "OK",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  const isConfirm = type === 'confirm';
  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          {isConfirm && (
            <button className="btn btn-outline" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={`btn ${isError ? 'btn-danger' : isSuccess ? 'btn-success' : 'btn-primary'}`}
            onClick={isConfirm ? onConfirm : onClose}
          >
            {isConfirm ? confirmText : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;