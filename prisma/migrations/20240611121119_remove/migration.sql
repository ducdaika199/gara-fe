/*
  Warnings:

  - You are about to drop the column `createdDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `InvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `InvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `InvoiceItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "createdDate",
ADD COLUMN     "joinDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "amount",
DROP COLUMN "price",
DROP COLUMN "taxRate";
