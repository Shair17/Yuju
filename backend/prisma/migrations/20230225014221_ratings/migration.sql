/*
  Warnings:

  - You are about to drop the column `facebookAccessToken` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `facebookId` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `facebookAccessToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `facebookId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fb_id]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fb_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fb_access_token` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fb_id` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fb_access_token` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fb_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "drivers_facebookId_key";

-- DropIndex
DROP INDEX "users_facebookId_key";

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "facebookAccessToken",
DROP COLUMN "facebookId",
ADD COLUMN     "fb_access_token" VARCHAR(512) NOT NULL,
ADD COLUMN     "fb_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "facebookAccessToken",
DROP COLUMN "facebookId",
ADD COLUMN     "fb_access_token" VARCHAR(512) NOT NULL,
ADD COLUMN     "fb_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drivers_fb_id_key" ON "drivers"("fb_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_fb_id_key" ON "users"("fb_id");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
