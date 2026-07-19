/*
  Warnings:

  - You are about to drop the column `active` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `madeToOrder` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `AdminUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerApproval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeasurementProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeasurementValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaAsset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderStatusHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductionJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductionMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RawMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialPost` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_adminUserId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerApproval" DROP CONSTRAINT "CustomerApproval_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerApproval" DROP CONSTRAINT "CustomerApproval_orderId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_rawMaterialId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementProfile" DROP CONSTRAINT "MeasurementProfile_customerId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementValue" DROP CONSTRAINT "MeasurementValue_profileId_fkey";

-- DropForeignKey
ALTER TABLE "MediaAsset" DROP CONSTRAINT "MediaAsset_orderId_fkey";

-- DropForeignKey
ALTER TABLE "MediaAsset" DROP CONSTRAINT "MediaAsset_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderStatusHistory" DROP CONSTRAINT "OrderStatusHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionJob" DROP CONSTRAINT "ProductionJob_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionJob" DROP CONSTRAINT "ProductionJob_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionMaterial" DROP CONSTRAINT "ProductionMaterial_productionJobId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionMaterial" DROP CONSTRAINT "ProductionMaterial_rawMaterialId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SocialPost" DROP CONSTRAINT "SocialPost_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "active",
DROP COLUMN "categoryId",
DROP COLUMN "madeToOrder",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AdminUser";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "CustomerAddress";

-- DropTable
DROP TABLE "CustomerApproval";

-- DropTable
DROP TABLE "InventoryMovement";

-- DropTable
DROP TABLE "MeasurementProfile";

-- DropTable
DROP TABLE "MeasurementValue";

-- DropTable
DROP TABLE "MediaAsset";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "OrderStatusHistory";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "ProductionJob";

-- DropTable
DROP TABLE "ProductionMaterial";

-- DropTable
DROP TABLE "RawMaterial";

-- DropTable
DROP TABLE "Shipment";

-- DropTable
DROP TABLE "SocialPost";

-- DropEnum
DROP TYPE "ApprovalStatus";

-- DropEnum
DROP TYPE "FulfilmentStatus";

-- DropEnum
DROP TYPE "InventoryMovementType";

-- DropEnum
DROP TYPE "MediaKind";

-- DropEnum
DROP TYPE "MediaStatus";

-- DropEnum
DROP TYPE "OrderSource";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "ProductionStatus";

-- DropEnum
DROP TYPE "PublishChannel";

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
