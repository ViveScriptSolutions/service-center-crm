-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ITEM_RECEIVED', 'IN_QUEUE', 'UNDER_REPAIR', 'AWAITING_PARTS', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "receiptNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'ITEM_RECEIVED',
    "notes" TEXT,
    "customerId" INTEGER NOT NULL,
    "assignedToId" INTEGER,
    "checkInDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printerBrand" TEXT,
    "printerModel" TEXT,
    "printerSerial" TEXT,
    "accessoriesReceived" TEXT,
    "imageUrl1" TEXT,
    "imageUrl2" TEXT,
    "imageUrl3" TEXT,
    "initialObservations" TEXT,
    "problemsReported" TEXT NOT NULL,
    "possibleCauses" TEXT,
    "physicalDamageFound" BOOLEAN NOT NULL DEFAULT false,
    "physicalDamageDescription" TEXT,
    "partsLikelyNeeded" TEXT,
    "diagnosisNotes" TEXT,
    "diagnosedById" INTEGER,
    "expectedDeliveryDate" TIMESTAMP(3),
    "repairSummary" TEXT,
    "workDone" TEXT,
    "partsReplaced" JSONB,
    "partsCost" DECIMAL(10,2),
    "laborCost" DECIMAL(10,2),
    "otherCharges" DECIMAL(10,2),
    "totalCharge" DECIMAL(10,2),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "customerNotifiedDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "pickupDate" TIMESTAMP(3),
    "customerPickedUp" BOOLEAN NOT NULL DEFAULT false,
    "deliveryTimestamp" TIMESTAMP(3),
    "deliveredById" INTEGER,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job_receiptNo_key" ON "Job"("receiptNo");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_diagnosedById_fkey" FOREIGN KEY ("diagnosedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_deliveredById_fkey" FOREIGN KEY ("deliveredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
