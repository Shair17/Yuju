/*
  Warnings:

  - You are about to drop the `memberships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_driverId_fkey";

-- DropTable
DROP TABLE "memberships";

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);
