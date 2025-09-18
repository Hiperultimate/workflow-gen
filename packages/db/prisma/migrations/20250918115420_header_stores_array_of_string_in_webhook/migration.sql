/*
  Warnings:

  - The `header` column on the `Webhook` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Webhook" DROP COLUMN "header",
ADD COLUMN     "header" TEXT[] DEFAULT ARRAY[]::TEXT[];
