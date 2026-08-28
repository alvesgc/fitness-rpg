/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `XPTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlayerProfile" DROP CONSTRAINT "PlayerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSession" DROP CONSTRAINT "WorkoutSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSession" DROP CONSTRAINT "WorkoutSession_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSet" DROP CONSTRAINT "WorkoutSet_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSet" DROP CONSTRAINT "WorkoutSet_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "XPTransaction" DROP CONSTRAINT "XPTransaction_userId_fkey";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "PlayerProfile";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Workout";

-- DropTable
DROP TABLE "WorkoutExercise";

-- DropTable
DROP TABLE "WorkoutSession";

-- DropTable
DROP TABLE "WorkoutSet";

-- DropTable
DROP TABLE "XPTransaction";

-- DropEnum
DROP TYPE "MuscleGroup";

-- DropEnum
DROP TYPE "WorkoutSessionStatus";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "player_profiles_userId_key" ON "player_profiles"("userId");

-- CreateIndex
CREATE INDEX "xp_transactions_userId_idx" ON "xp_transactions"("userId");

-- AddForeignKey
ALTER TABLE "player_profiles" ADD CONSTRAINT "player_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
