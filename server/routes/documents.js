import express from 'express';
import { uploadMiddleware } from '../middleware/upload.js';
import { processDocument } from '../services/documents.js';

const router = express.Router();

router.post('/', uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const { provider = 'gemini' } = req.query;
    const result = await processDocument(req.file, title, provider);

    res.json({ 
      success: true, 
      data: result.data,
      provider,
      chunksProcessed: result.chunksProcessed 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as documentsRouter };
