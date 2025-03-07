-- CreateTable
CREATE TABLE "ImageFile" (
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL,

    CONSTRAINT "ImageFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_filePath_key" ON "ImageFile"("filePath");

-- CreateIndex
CREATE INDEX "ImageFile_filePath_userId_isArchived_idx" ON "ImageFile"("filePath", "userId", "isArchived");

-- CreateIndex
CREATE INDEX "ImageFile_isArchived_filePath_idx" ON "ImageFile"("isArchived", "filePath");
