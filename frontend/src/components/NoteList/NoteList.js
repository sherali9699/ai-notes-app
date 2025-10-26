import React, { useState } from 'react';
import axios from 'axios';
import NoteItem from '../NoteItem/NoteItem';
import Modal from '../Common/Modal';

const NoteList = ({ notes, setCurrentNote, setIsEditing, fetchNotes, searchTerm }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  const handleEditNote = (note) => {
    setCurrentNote({
      _id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags || []
    });
    setIsEditing(true);
    document.querySelector('.note-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (noteId, noteTitle) => {
    setModal({
      isOpen: true,
      title: 'Delete Note',
      message: `Are you sure you want to delete "${noteTitle}"? This action cannot be undone.`,
      type: 'confirm',
      onConfirm: () => handleDeleteConfirm(noteId)
    });
  };

  const handleDeleteConfirm = async (noteId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
      fetchNotes();
      setModal({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });
    } catch (error) {
      console.error('Error deleting note:', error);
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete note. Please try again.',
        type: 'error'
      });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });
  };

  return (
    <>
      <div className="notes-list">
        <div className="notes-count">
          {notes.length} note{notes.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </div>
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3 className="empty-state-title">No notes found</h3>
              <p className="empty-state-description">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}
              </p>
            </div>
          ) : (
            notes.map(note => (
              <NoteItem 
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteClick}
                onFetchNotes={fetchNotes}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText="Delete"
      />
    </>
  );
};

export default NoteList;