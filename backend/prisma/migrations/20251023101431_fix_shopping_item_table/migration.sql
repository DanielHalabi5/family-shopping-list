/*
  Warnings:

  - You are about to drop the column `description` on the `ShoppingItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" DROP COLUMN "description",
ADD COLUMN     "quantity" TEXT;
