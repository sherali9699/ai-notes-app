import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../Common/Modal';

const API_URL = 'http://localhost:5000/api';

const AIActions = ({ note, onSummarize, isSummarizing, onFetchNotes }) => {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const handleGenerateTitle = async () => {
    if (note.content.length < 20) {
      showModal('Content Too Short', 'Note content is too short for title generation.', 'error');
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const response = await axios.post(`${API_URL}/notes/${note._id}/generate-title`);
      showModal(
        'AI Suggested Title', 
        `"${response.data.generatedTitle}"\n\nYou can copy this and edit your note if you like it.`
      );
    } catch (error) {
      console.error('Error generating title:', error);
      showModal(
        'Error', 
        error.response?.data?.message || 'Failed to generate title. Please try again.',
        'error'
      );
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  return (
    <>
      <div className="ai-actions">
        <button
          className={`ai-button ${isSummarizing ? 'loading' : ''}`}
          onClick={onSummarize}
          disabled={isSummarizing || note.content.length < 50}
          title="Generate AI summary"
        >
          {isSummarizing ? 'Summarizing...' : '🤖 Summarize'}
        </button>

        <button
          className={`ai-button ${isGeneratingTitle ? 'loading' : ''}`}
          onClick={handleGenerateTitle}
          disabled={isGeneratingTitle || note.content.length < 20}
          title="Generate AI title suggestion"
        >
          {isGeneratingTitle ? 'Generating...' : '💡 Suggest Title'}
        </button>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
};

export default AIActions;