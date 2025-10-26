const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const aiService = require('../services/aiservice');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new note
router.post('/', async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || []
    });

    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags || []
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST generate AI summary for a note
router.post('/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.content || note.content.trim().length < 50) {
      return res.status(400).json({ 
        message: 'Note content is too short for summarization. Minimum 50 characters required.' 
      });
    }

    const summary = await aiService.generateSummary(note.content);
    
    // Update the note with the generated summary
    note.summary = summary;
    note.isAISummary = true;
    await note.save();

    res.json({
      note: note,
      summary: summary,
      message: 'Summary generated successfully'
    });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to generate summary' 
    });
  }
});

// POST generate AI title for a note
router.post('/:id/generate-title', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.content || note.content.trim().length < 20) {
      return res.status(400).json({ 
        message: 'Note content is too short for title generation' 
      });
    }

    const title = await aiService.generateSmartTitle(note.content);
    
    res.json({
      generatedTitle: title,
      message: 'Title generated successfully'
    });
  } catch (error) {
    console.error('Title generation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to generate title' 
    });
  }
});

// POST create note with AI-generated title
router.post('/ai/create', async (req, res) => {
  try {
    const { content, tags = [] } = req.body;

    if (!content || content.trim().length < 20) {
      return res.status(400).json({ 
        message: 'Content is required and should be at least 20 characters long' 
      });
    }

    // Generate title using AI
    const title = await aiService.generateSmartTitle(content);

    const note = new Note({
      title: title,
      content: content,
      tags: tags
    });

    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to create note with AI' 
    });
  }
});

module.exports = router;