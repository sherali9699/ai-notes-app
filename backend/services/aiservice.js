const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });
  }

  async generateSummary(content) {
    try {
      if (!content || content.trim().length < 50) {
        throw new Error('Content too short for summarization. Minimum 50 characters required.');
      }

      const prompt = `Please provide a concise summary (2-3 sentences maximum) of the following text. Focus on the key points and main ideas:

${content}

Summary:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text().trim();

      return summary;
    } catch (error) {
      console.error('AI Summarization error:', error);
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  async generateSmartTitle(content) {
    try {
      if (!content || content.trim().length < 20) {
        throw new Error('Content too short for title generation');
      }

      const prompt = `Generate a short, descriptive title (max 5-7 words) for the following text:

${content}

Title:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const title = response.text().trim().replace(/["']/g, '');

      return title;
    } catch (error) {
      console.error('AI Title generation error:', error);
      throw new Error(`Failed to generate title: ${error.message}`);
    }
  }
// Test method to check API connection (FIXED TYPO)
  async testConnection() {
    try {
      if (!this.model) {
        return { success: false, error: 'AI model not initialized. Check GEMINI_API_KEY.' };
      }

      const prompt = "Say 'Hello World' in a creative way";
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return { success: true, message: response.text() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
module.exports = new AIService();