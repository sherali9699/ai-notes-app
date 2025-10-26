const express = require('express');
const router = express.Router();
const aiService = require('../services/aiservice');

// Test AI connection
router.get('/test', async (req, res) => {
  try {
    const result = await aiService.testConnection();
    
    if (result.success) {
      res.json({
        status: 'success',
        message: 'Gemini API is working correctly!',
        response: result.message,
        model: 'gemini-2.5-flash'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Gemini API connection failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Test failed',
      error: error.message
    });
  }
});

// Test summarization with sample content
router.get('/test-summary', async (req, res) => {
  try {
    const sampleContent = `Artificial intelligence is transforming how we work and live. Machine learning algorithms can now understand natural language, recognize images, and make predictions with remarkable accuracy. This technology is being applied in healthcare, finance, education, and many other fields to solve complex problems and improve efficiency. The rapid advancement of AI promises to bring even more significant changes in the coming years.`;

    const summary = await aiService.generateSummary(sampleContent);
    
    res.json({
      status: 'success',
      message: 'Summary generated successfully',
      original: sampleContent,
      summary: summary,
      model: 'gemini-2.5-flash'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate summary',
      error: error.message
    });
  }
});

// Test title generation with sample content
router.get('/test-title', async (req, res) => {
  try {
    const sampleContent = `The impact of climate change on global agriculture is becoming increasingly evident. Rising temperatures, changing precipitation patterns, and more frequent extreme weather events are affecting crop yields worldwide. Farmers are having to adapt by changing planting schedules, using new crop varieties, and implementing different farming practices to maintain productivity.`;

    const title = await aiService.generateSmartTitle(sampleContent);
    
    res.json({
      status: 'success',
      message: 'Title generated successfully',
      original: sampleContent,
      generatedTitle: title,
      model: 'gemini-2.5-flash'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate title',
      error: error.message
    });
  }
});

module.exports = router;