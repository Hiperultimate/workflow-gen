/*
  Warnings:

  - You are about to drop the column `webhookId` on the `Workflow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workflowId]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workflowId` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Workflow" DROP CONSTRAINT "Workflow_webhookId_fkey";

-- DropIndex
DROP INDEX "public"."Workflow_webhookId_key";

-- AlterTable
ALTER TABLE "public"."Webhook" ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "webhookId",
ALTER COLUMN "nodes" SET DEFAULT '{}',
ALTER COLUMN "connections" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_workflowId_key" ON "public"."Webhook"("workflowId");

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
