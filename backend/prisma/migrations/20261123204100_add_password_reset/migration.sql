/*
  Warnings:

  - You are about to drop the column `resetPasswordExpires` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `Incident` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Incident_resetPasswordToken_key";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "resetPasswordExpires",
DROP COLUMN "resetPasswordToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
