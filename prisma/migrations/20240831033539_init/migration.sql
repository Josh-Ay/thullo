/*
  Warnings:

  - You are about to drop the `labels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "labels" DROP CONSTRAINT "labels_cardId_fkey";

-- DropTable
DROP TABLE "labels";

-- CreateTable
CREATE TABLE "card_labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_labels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "card_labels" ADD CONSTRAINT "card_labels_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
