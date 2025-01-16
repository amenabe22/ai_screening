-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "recruiterId" INTEGER;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "recruiterId" INTEGER;

-- AlterTable
ALTER TABLE "VideoResponse" ADD COLUMN     "recruiterId" INTEGER;
