# AI Notes App

A smart notes application with AI-powered summarization built with the MERN stack.

## Features

- ✨ Create, edit, and delete notes
- 🤖 AI summarization using Gemini
- 🔍 Real-time search
- 🏷️ Tag organization
- 📱 Responsive design

## Tech Stack

**Frontend:** React, Custom CSS  
**Backend:** Node.js, Express, MongoDB  
**AI:** Google Gemini API

## Quick Start

### Prerequisites
- Node.js
- MongoDB
- Gemini API key

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Add your API key to .env
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Environment
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ai-notes-app
GEMINI_API_KEY=your_api_key
PORT=5000
```

## Usage

1. **Create Notes**: Use the form at the top
2. **AI Features**: Click "Summarize" or "Suggest Title" on any note
3. **Search**: Use the search bar to filter notes
4. **Manage**: Edit or delete notes with the action buttons

## API Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/summarize` - AI summary
- `POST /api/notes/:id/generate-title` - AI title

## Project Structure

```
frontend/src/components/
├── Common/Modal, LoadingState
├── Header/Header
├── NoteForm/NoteForm
├── NoteList/NoteList
├── NoteItem/NoteItem
├── SearchBar/SearchBar
└── AIActions/AIActions
```

## Development

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000) 
cd frontend && npm start
```

---

**Simple, fast, and smart note-taking with AI assistance.**