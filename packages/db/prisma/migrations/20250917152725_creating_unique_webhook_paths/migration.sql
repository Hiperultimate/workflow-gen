/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Webhook_path_key" ON "public"."Webhook"("path");
