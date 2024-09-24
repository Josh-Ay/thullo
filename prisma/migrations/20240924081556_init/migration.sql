-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "coverImageAuthor" TEXT,
ADD COLUMN     "coverImageAuthorProfile" TEXT;

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "coverImageAuthor" TEXT,
ADD COLUMN     "coverImageAuthorProfile" TEXT;
