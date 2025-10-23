/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingListId` on the `ShoppingItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ShoppingItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ShoppingList` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Family` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyId` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."ShoppingItem" DROP CONSTRAINT "ShoppingItem_shoppingListId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShoppingList" DROP CONSTRAINT "ShoppingList_familyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_familyId_fkey";

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "updatedAt",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "shoppingListId",
DROP COLUMN "updatedAt",
ADD COLUMN     "familyId" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "familyId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."ShoppingList";

-- CreateTable
CREATE TABLE "FamilyJoinRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Family_ownerId_key" ON "Family"("ownerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyJoinRequest" ADD CONSTRAINT "FamilyJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyJoinRequest" ADD CONSTRAINT "FamilyJoinRequest_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
