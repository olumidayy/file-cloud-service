-- DropForeignKey
ALTER TABLE "FileHistory" DROP CONSTRAINT "FileHistory_fileId_fkey";

-- AddForeignKey
ALTER TABLE "FileHistory" ADD CONSTRAINT "FileHistory_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
