-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "storagePath" TEXT;
