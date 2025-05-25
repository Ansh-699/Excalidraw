/*
  Warnings:

  - You are about to drop the column `slung` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Room_slung_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "slung",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");
