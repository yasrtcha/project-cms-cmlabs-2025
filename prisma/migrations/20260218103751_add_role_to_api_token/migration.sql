/*
  Warnings:

  - You are about to drop the column `locale` on the `ContentEntry` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `ContentEntry` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `ContentEntry` table. All the data in the column will be lost.
  - You are about to drop the column `seoKeywords` on the `ContentEntry` table. All the data in the column will be lost.
  - You are about to drop the column `seoSlug` on the `ContentEntry` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `ContentEntry` table. All the data in the column will be lost.
  - You are about to drop the `ContentRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FieldGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FieldValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PlanTier" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."ApiTokenRole" AS ENUM ('full_access', 'read_only');

-- DropForeignKey
ALTER TABLE "public"."ContentEntry" DROP CONSTRAINT "ContentEntry_contentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContentEntry" DROP CONSTRAINT "ContentEntry_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContentRelation" DROP CONSTRAINT "ContentRelation_fromEntryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContentRelation" DROP CONSTRAINT "ContentRelation_toEntryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContentType" DROP CONSTRAINT "ContentType_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Field" DROP CONSTRAINT "Field_fieldGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FieldGroup" DROP CONSTRAINT "FieldGroup_contentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FieldValue" DROP CONSTRAINT "FieldValue_entryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FieldValue" DROP CONSTRAINT "FieldValue_fieldId_fkey";

-- DropIndex
DROP INDEX "public"."ContentEntry_status_idx";

-- AlterTable
ALTER TABLE "public"."BuilderContentType" ADD COLUMN     "sectionsOrder" JSONB,
ADD COLUMN     "workflowId" TEXT;

-- AlterTable
ALTER TABLE "public"."ContentEntry" DROP COLUMN "locale",
DROP COLUMN "publishedAt",
DROP COLUMN "seoDescription",
DROP COLUMN "seoKeywords",
DROP COLUMN "seoSlug",
DROP COLUMN "seoTitle",
ADD COLUMN     "currentStepId" TEXT,
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "seoData" JSONB DEFAULT '{}',
ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "createdById" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."ContentRelation";

-- DropTable
DROP TABLE "public"."ContentType";

-- DropTable
DROP TABLE "public"."Field";

-- DropTable
DROP TABLE "public"."FieldGroup";

-- DropTable
DROP TABLE "public"."FieldValue";

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "public"."PlanTier" NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "maxPersonalProjects" INTEGER,
    "maxOrganizations" INTEGER,
    "maxOrgProjects" INTEGER,
    "maxTeamMembersPerOrg" INTEGER,
    "maxContentEntriesPerProject" INTEGER,
    "maxCustomDomains" INTEGER,
    "maxApiCallsPerMonth" INTEGER,
    "maxMediaStorageMB" INTEGER,
    "maxContentTypesPerProject" INTEGER,
    "maxLocalizations" INTEGER,
    "auditLogRetentionDays" INTEGER NOT NULL DEFAULT 7,
    "hasCustomDomains" BOOLEAN NOT NULL DEFAULT false,
    "hasLocalization" BOOLEAN NOT NULL DEFAULT false,
    "hasWhiteLabel" BOOLEAN NOT NULL DEFAULT false,
    "supportLevel" TEXT NOT NULL DEFAULT 'community',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usage" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "personalProjectsCount" INTEGER NOT NULL DEFAULT 0,
    "organizationsCount" INTEGER NOT NULL DEFAULT 0,
    "orgProjectsCount" INTEGER NOT NULL DEFAULT 0,
    "apiCallsMonth" INTEGER NOT NULL DEFAULT 0,
    "mediaStorageUsedMB" INTEGER NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "stripeInvoiceId" TEXT,
    "invoiceNumber" TEXT,
    "invoiceUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiToken" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "token" TEXT NOT NULL,
    "role" "public"."ApiTokenRole" NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "scope" TEXT NOT NULL DEFAULT 'Custom',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowStep" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "roleId" TEXT,
    "workflowId" TEXT NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentWorkflowLog" (
    "id" TEXT NOT NULL,
    "contentEntryId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "stepName" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentWorkflowLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityName" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PageComponents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PageComponents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_tier_key" ON "public"."Plan"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "public"."Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "public"."Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "public"."Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "public"."Subscription"("planId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "public"."Subscription"("status");

-- CreateIndex
CREATE INDEX "Usage_subscriptionId_idx" ON "public"."Usage"("subscriptionId");

-- CreateIndex
CREATE INDEX "Usage_periodStart_periodEnd_idx" ON "public"."Usage"("periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeInvoiceId_key" ON "public"."Invoice"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "Invoice_userId_idx" ON "public"."Invoice"("userId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "public"."Invoice"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_token_key" ON "public"."ApiToken"("token");

-- CreateIndex
CREATE INDEX "ApiToken_projectId_idx" ON "public"."ApiToken"("projectId");

-- CreateIndex
CREATE INDEX "Workflow_projectId_idx" ON "public"."Workflow"("projectId");

-- CreateIndex
CREATE INDEX "WorkflowStep_workflowId_idx" ON "public"."WorkflowStep"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowStep_roleId_idx" ON "public"."WorkflowStep"("roleId");

-- CreateIndex
CREATE INDEX "ContentWorkflowLog_contentEntryId_idx" ON "public"."ContentWorkflowLog"("contentEntryId");

-- CreateIndex
CREATE INDEX "ContentWorkflowLog_actorId_idx" ON "public"."ContentWorkflowLog"("actorId");

-- CreateIndex
CREATE INDEX "ActivityLog_projectId_idx" ON "public"."ActivityLog"("projectId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "public"."ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "_PageComponents_B_index" ON "public"."_PageComponents"("B");

-- CreateIndex
CREATE INDEX "BuilderContentType_workflowId_idx" ON "public"."BuilderContentType"("workflowId");

-- CreateIndex
CREATE INDEX "ContentEntry_currentStepId_idx" ON "public"."ContentEntry"("currentStepId");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usage" ADD CONSTRAINT "Usage_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiToken" ADD CONSTRAINT "ApiToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowStep" ADD CONSTRAINT "WorkflowStep_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuilderContentType" ADD CONSTRAINT "BuilderContentType_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentEntry" ADD CONSTRAINT "ContentEntry_currentStepId_fkey" FOREIGN KEY ("currentStepId") REFERENCES "public"."WorkflowStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentEntry" ADD CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "public"."BuilderContentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentEntry" ADD CONSTRAINT "ContentEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentWorkflowLog" ADD CONSTRAINT "ContentWorkflowLog_contentEntryId_fkey" FOREIGN KEY ("contentEntryId") REFERENCES "public"."ContentEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentWorkflowLog" ADD CONSTRAINT "ContentWorkflowLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PageComponents" ADD CONSTRAINT "_PageComponents_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BuilderContentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PageComponents" ADD CONSTRAINT "_PageComponents_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."BuilderContentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
