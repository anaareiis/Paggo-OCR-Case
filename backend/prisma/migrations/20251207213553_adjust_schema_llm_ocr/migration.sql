/*
  Warnings:

  - You are about to drop the column `meta` on the `LLMInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `LLMInteraction` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `LLMInteraction` table. All the data in the column will be lost.
  - Added the required column `answer` to the `LLMInteraction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `LLMInteraction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "LLMInteraction" DROP CONSTRAINT "LLMInteraction_documentId_fkey";

-- DropForeignKey
ALTER TABLE "LLMInteraction" DROP CONSTRAINT "LLMInteraction_userId_fkey";

-- DropForeignKey
ALTER TABLE "OCRResult" DROP CONSTRAINT "OCRResult_documentId_fkey";

-- AlterTable
ALTER TABLE "LLMInteraction" DROP COLUMN "meta",
DROP COLUMN "prompt",
DROP COLUMN "response",
ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "rawResponse" JSONB;

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "LLMInteraction_userId_idx" ON "LLMInteraction"("userId");

-- CreateIndex
CREATE INDEX "LLMInteraction_documentId_idx" ON "LLMInteraction"("documentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OCRResult" ADD CONSTRAINT "OCRResult_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMInteraction" ADD CONSTRAINT "LLMInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMInteraction" ADD CONSTRAINT "LLMInteraction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
