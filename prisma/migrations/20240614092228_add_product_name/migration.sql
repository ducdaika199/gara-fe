-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TypeWork" AS ENUM ('SUPPLIES', 'REPAIRS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "email" TEXT,
    "name" TEXT,
    "code" TEXT,
    "phoneNumber" TEXT,
    "plateNumber" TEXT,
    "address" TEXT,
    "carName" TEXT,
    "carType" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "isAdmin" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "description" TEXT,
    "countUnit" TEXT,
    "priceUnit" BIGINT NOT NULL,
    "ck" INTEGER DEFAULT 0,
    "tax" INTEGER DEFAULT 0,
    "type" "TypeWork" NOT NULL DEFAULT 'SUPPLIES',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "userRequest" TEXT,
    "joinDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "totalAmount" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "productName" TEXT NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
