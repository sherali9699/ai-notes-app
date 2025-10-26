import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <div className="search-icon">🔍</div>
      <input
        type="text"
        className="form-control search-input"
        placeholder="Search notes by title, content, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;