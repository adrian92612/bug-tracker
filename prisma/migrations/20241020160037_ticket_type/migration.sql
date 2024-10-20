-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('BUG', 'TASK', 'OTHERS');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "type" "TicketType" NOT NULL DEFAULT 'BUG';
