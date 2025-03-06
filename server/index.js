import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupMiddleware } from './middleware/index.js';
import { setupRoutes } from './routes/index.js';
import { config } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Setup middleware
setupMiddleware(app);

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Setup routes
setupRoutes(app);

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
