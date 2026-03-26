import 'dotenv/config'; // Crucial: Loads your .env before anything else
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing in your .env file');
}

// Pass the connection string to the adapter, then the adapter to the client
const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter });
