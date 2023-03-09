-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Yape', 'Plin', 'Cash', 'Other');

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "payment" DOUBLE PRECISION NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "payment_info" TEXT,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "driverId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
