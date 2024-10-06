/*
  Warnings:

  - You are about to drop the column `options` on the `VotingEvent` table. All the data in the column will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "VotingEvent" DROP COLUMN "options";

-- DropTable
DROP TABLE "Vote";

-- CreateTable
CREATE TABLE "VotingOption" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "option" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "votedUsers" INTEGER[],

    CONSTRAINT "VotingOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VotingOption_eventId_option_key" ON "VotingOption"("eventId", "option");

-- AddForeignKey
ALTER TABLE "VotingOption" ADD CONSTRAINT "VotingOption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "VotingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
