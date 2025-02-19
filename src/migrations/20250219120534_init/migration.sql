/*
  Warnings:

  - Made the column `description` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Job` MODIFY `title` TEXT NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Question` MODIFY `text` TEXT NOT NULL;
