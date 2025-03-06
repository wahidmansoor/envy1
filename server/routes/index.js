import { documentsRouter } from './documents.js';

export function setupRoutes(app) {
  app.use('/api/documents', documentsRouter);
}
