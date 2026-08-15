import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import pdfRoutes from './routes/pdf.route.js';
import { initializeIndex } from './vector/createVectorDBIndex.js';

const app = express();

// 1. CORS MUST COME FIRST
const corsOptions = {
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 2. Body Parser
app.use(express.json());

// 3. Authentication
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must both be set');
}

app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);

// 4. Base Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 5. API Routes
app.use('/api', chatRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', pdfRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initializeIndex();
  } catch (err) {
    console.warn('Vector db failed, continuing...', err);
  }

  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
}

start();