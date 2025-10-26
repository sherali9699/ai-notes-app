import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import Components
import Header from './components/Header/Header';
import NoteForm from './components/NoteForm/NoteForm';
import SearchBar from './components/SearchBar/SearchBar';
import NoteList from './components/NoteList/NoteList';
import LoadingState from './components/Common/LoadingState';

// API base URL
const API_URL = 'http://localhost:5000/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentNote, setCurrentNote] = useState({ 
    title: '', 
    content: '', 
    tags: [] 
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          
          {/* Note Form - Always Visible */}
          <section className="note-form-section">
            <NoteForm 
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              fetchNotes={fetchNotes}
            />
          </section>

          {/* Search Bar */}
          <section className="search-section">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </section>

          {/* Notes List */}
          <section className="notes-section">
            {loading ? (
              <LoadingState />
            ) : (
              <NoteList 
                notes={filteredNotes}
                setCurrentNote={setCurrentNote}
                setIsEditing={setIsEditing}
                fetchNotes={fetchNotes}
                searchTerm={searchTerm}
              />
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;