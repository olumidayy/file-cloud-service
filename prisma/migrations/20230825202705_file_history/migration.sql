/*
  Warnings:

  - You are about to drop the column `name` on the `FileHistory` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `FileHistory` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FileAction" ADD VALUE 'UPLOAD';
ALTER TYPE "FileAction" ADD VALUE 'STREAM';
ALTER TYPE "FileAction" ADD VALUE 'DELETE';

-- DropForeignKey
ALTER TABLE "FileHistory" DROP CONSTRAINT "FileHistory_fileId_fkey";

-- AlterTable
ALTER TABLE "FileHistory" DROP COLUMN "name",
DROP COLUMN "size";

-- AddForeignKey
ALTER TABLE "FileHistory" ADD CONSTRAINT "FileHistory_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
