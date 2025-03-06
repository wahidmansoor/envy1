import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import documentsRouter from './routes/documents.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/documents', documentsRouter);

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`RAG server running on port ${port}`);
});
