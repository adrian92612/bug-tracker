/*
  Warnings:

  - Added the required column `deadline` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ONGOING', 'CLOSED', 'OVERDUE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ONGOING';
