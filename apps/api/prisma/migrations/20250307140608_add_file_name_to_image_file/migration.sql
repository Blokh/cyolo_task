/*
  Warnings:

  - Added the required column `originalFileName` to the `ImageFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageFile" ADD COLUMN     "originalFileName" TEXT NOT NULL;
