import React from 'react';
import './ResumePanel.css';
import './ResumePanelExtras.css';
import { X } from 'lucide-react';

const ResumePanel = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="panel-container">
      <div className="panel-backdrop" onClick={onClose}></div>
      <div className="panel-content">
        <button className="panel-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="panel-header">
          <div className="panel-category">SYSTEM_LOG // {node.id.toUpperCase()}</div>
          <h2 className="panel-title">{node.title}</h2>
        </div>

        <div className="panel-body">
          <div className="panel-section scroll-area">
            <h4>[ DETAILED_DATA_STREAM ]</h4>
            <div className="panel-long-text focus-text">
              {node.details}
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <div className="system-status">
            <span className="pulse-dot"></span> SECURE_CONNECTION_ESTABLISHED
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePanel;
