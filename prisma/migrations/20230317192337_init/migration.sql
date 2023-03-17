/*
  Warnings:

  - You are about to drop the column `address` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Attendee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[creatorId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_eventId_fkey";

-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "address",
DROP COLUMN "contact",
DROP COLUMN "email",
DROP COLUMN "eventId",
DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contact" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_userId_key" ON "Attendee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_creatorId_key" ON "Event"("creatorId");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
