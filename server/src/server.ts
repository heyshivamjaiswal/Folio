import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import pdfRoutes from './routes/pdf.route.js';
import { initializeIndex } from './vector/createVectorDBIndex.js';

const app = express();
app.use(clerkMiddleware());

app.use(
  cors({
    origin: 'http://localhost:5173', // your Vite frontend port
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api', chatRoutes);

app.use('/api', bookmarkRoutes);

app.use('/api', pdfRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  await initializeIndex();

  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
}

start();
