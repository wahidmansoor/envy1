import express from 'express';
import cors from 'cors';

export function setupMiddleware(app) {
  // Enable CORS for all routes
  app.use(cors());
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Health check middleware
  app.use('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
}
