import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../Common/Modal';

const API_URL = 'http://localhost:5000/api';

const NoteForm = ({ currentNote, setCurrentNote, isEditing, setIsEditing, fetchNotes }) => {
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      showModal('Missing Information', 'Please fill in both title and content', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/notes/${currentNote._id}`, currentNote);
        showModal('Success', 'Note updated successfully!', 'success');
      } else {
        await axios.post(`${API_URL}/notes`, currentNote);
        showModal('Success', 'Note created successfully!', 'success');
      }

      setCurrentNote({ title: '', content: '', tags: [] });
      setIsEditing(false);
      await fetchNotes();
      
    } catch (error) {
      console.error('Error saving note:', error);
      showModal('Error', 'Failed to save note. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentNote({ title: '', content: '', tags: [] });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !currentNote.tags.includes(tagInput.trim())) {
      setCurrentNote({
        ...currentNote,
        tags: [...currentNote.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setCurrentNote({
      ...currentNote,
      tags: currentNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <>
      <div className="note-form">
        <div className="form-header">
          <h2 className="form-title">
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label htmlFor="note-title" className="form-label">Title</label>
              <input
                type="text"
                id="note-title"
                className="form-control"
                placeholder="Enter note title..."
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="note-content" className="form-label">Content</label>
              <textarea
                id="note-content"
                className="form-control"
                rows="6"
                placeholder="Write your note content here..."
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="note-tags" className="form-label">Tags</label>
              <div className="tags-input-container">
                <div className="tags-display">
                  {currentNote.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="tag-input-group">
                  <input
                    type="text"
                    id="note-tags"
                    className="form-control"
                    placeholder="Add a tag and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleAddTag}
                    disabled={loading || !tagInput.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            {isEditing && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !currentNote.title.trim() || !currentNote.content.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Note' : 'Create Note'
              )}
            </button>
          </div>
        </form>
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

export default NoteForm;