-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "totalAttachments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalComments" INTEGER NOT NULL DEFAULT 0;
