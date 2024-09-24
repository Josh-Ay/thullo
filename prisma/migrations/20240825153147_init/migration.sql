/*
  Warnings:

  - You are about to drop the column `visiblity` on the `boards` table. All the data in the column will be lost.
  - Added the required column `visibility` to the `boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "boards" DROP COLUMN "visiblity",
ADD COLUMN     "visibility" TEXT NOT NULL;
