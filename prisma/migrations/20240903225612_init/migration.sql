/*
  Warnings:

  - You are about to drop the column `downloadLink` on the `attachments` table. All the data in the column will be lost.
  - You are about to drop the column `fileImageLink` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `attachmentFile` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileExtension` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "downloadLink",
DROP COLUMN "fileImageLink",
ADD COLUMN     "attachmentFile" TEXT NOT NULL,
ADD COLUMN     "fileExtension" TEXT NOT NULL;
