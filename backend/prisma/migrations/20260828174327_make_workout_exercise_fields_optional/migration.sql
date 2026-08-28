/*
  Warnings:

  - The `muscleGroup` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `WorkoutSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `PlayerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkoutSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS', 'GLUTES', 'ABS', 'CALVES', 'FOREARMS', 'CARDIO', 'FULL_BODY');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "equipment" TEXT,
ADD COLUMN     "videoUrl" TEXT,
DROP COLUMN "muscleGroup",
ADD COLUMN     "muscleGroup" "MuscleGroup";

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutSession" DROP COLUMN "status",
ADD COLUMN     "status" "WorkoutSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS';
