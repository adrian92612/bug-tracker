/*
  Warnings:

  - The values [ONGOING,CLOSED,OVERDUE] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,MANAGER,DEVELOPER,CONTRIBUTOR,USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [LOW,MEDIUM,HIGH,CRITICAL] on the enum `TicketPriority` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN,IN_PROGRESS,IN_REVIEW,RESOLVED,CLOSED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [BUG,TASK,OTHERS] on the enum `TicketType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('Ongoing', 'Closed', 'Overdue');
ALTER TABLE "Project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "status" TYPE "ProjectStatus_new" USING ("status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "ProjectStatus_old";
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'Ongoing';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Admin', 'Manager', 'Developer', 'Contributor', 'None');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'None';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TicketPriority_new" AS ENUM ('Low', 'Medium', 'High', 'Critical');
ALTER TABLE "Ticket" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "priority" TYPE "TicketPriority_new" USING ("priority"::text::"TicketPriority_new");
ALTER TYPE "TicketPriority" RENAME TO "TicketPriority_old";
ALTER TYPE "TicketPriority_new" RENAME TO "TicketPriority";
DROP TYPE "TicketPriority_old";
ALTER TABLE "Ticket" ALTER COLUMN "priority" SET DEFAULT 'Medium';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('Open', 'In_Progress', 'In_Review', 'Resolved', 'Closed');
ALTER TABLE "Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'Open';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TicketType_new" AS ENUM ('Bug', 'Task', 'Others');
ALTER TABLE "Ticket" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "type" TYPE "TicketType_new" USING ("type"::text::"TicketType_new");
ALTER TYPE "TicketType" RENAME TO "TicketType_old";
ALTER TYPE "TicketType_new" RENAME TO "TicketType";
DROP TYPE "TicketType_old";
ALTER TABLE "Ticket" ALTER COLUMN "type" SET DEFAULT 'Bug';
COMMIT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'Ongoing';

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'Open',
ALTER COLUMN "priority" SET DEFAULT 'Medium',
ALTER COLUMN "type" SET DEFAULT 'Bug';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'None';
