/*
  Warnings:

  - A unique constraint covering the columns `[resetPasswordToken]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Incident_resetPasswordToken_key" ON "Incident"("resetPasswordToken");
