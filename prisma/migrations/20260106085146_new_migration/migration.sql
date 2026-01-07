-- CreateTable
CREATE TABLE "public"."BuilderContentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "hasSeo" BOOLEAN NOT NULL DEFAULT false,
    "hasWorkflow" BOOLEAN NOT NULL DEFAULT false,
    "hasMultiLang" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuilderContentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuilderFieldGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "contentTypeId" TEXT NOT NULL,

    CONSTRAINT "BuilderFieldGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuilderField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isUnique" BOOLEAN NOT NULL DEFAULT false,
    "fieldGroupId" TEXT NOT NULL,
    "options" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuilderField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BuilderContentType_projectId_idx" ON "public"."BuilderContentType"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "BuilderContentType_projectId_slug_key" ON "public"."BuilderContentType"("projectId", "slug");

-- CreateIndex
CREATE INDEX "BuilderFieldGroup_contentTypeId_idx" ON "public"."BuilderFieldGroup"("contentTypeId");

-- CreateIndex
CREATE INDEX "BuilderField_fieldGroupId_idx" ON "public"."BuilderField"("fieldGroupId");

-- AddForeignKey
ALTER TABLE "public"."BuilderContentType" ADD CONSTRAINT "BuilderContentType_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuilderFieldGroup" ADD CONSTRAINT "BuilderFieldGroup_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "public"."BuilderContentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuilderField" ADD CONSTRAINT "BuilderField_fieldGroupId_fkey" FOREIGN KEY ("fieldGroupId") REFERENCES "public"."BuilderFieldGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
