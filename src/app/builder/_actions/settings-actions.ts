'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

// ============================================================================
// 1. API INTEGRATION ACTIONS
// ============================================================================

/**
 * Membuat API Token baru & Mencatat Activity Log
 */
export async function createApiToken(projectId: string, formData: {
  name: string;
  description: string;
  validity: string;
  scope: string;
  permissions: any;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Generate Token Rahasia
    const secretToken = `wf_sk_${uuidv4().replace(/-/g, "")}`;

    // 2. Hitung Tanggal Kadaluarsa
    let expiresAt: Date | null = null;
    const now = new Date();
    
    if (formData.validity === "7 Days") {
      expiresAt = new Date(now.setDate(now.getDate() + 7));
    } else if (formData.validity === "30 Days") {
      expiresAt = new Date(now.setDate(now.getDate() + 30));
    } else if (formData.validity === "90 Days") {
      expiresAt = new Date(now.setDate(now.getDate() + 90));
    }

    // 3. Database Transaction (Simpan Token + Catat Log)
    await prisma.$transaction(async (tx) => {
      // A. Simpan Token
      const token = await tx.apiToken.create({
        data: {
          name: formData.name,
          description: formData.description,
          token: secretToken,
          scope: formData.scope,
          permissions: formData.permissions,
          expiresAt: expiresAt,
          projectId: projectId,
        },
      });

      // B. Catat Activity Log
      await tx.activityLog.create({
        data: {
          action: "CREATE_API_TOKEN",
          entityType: "ApiToken",
          entityId: token.id,
          entityName: token.name,
          userId: session.user.id!,
          projectId: projectId,
          details: { scope: formData.scope, validity: formData.validity }
        }
      });
    });

    revalidatePath(`/builder/${projectId}/settings/api-integration`);
    return { success: true };

  } catch (error) {
    console.error("Error creating API Token:", error);
    return { success: false, error: "Failed to create token" };
  }
}

/**
 * Menghapus API Token & Mencatat Log
 */
export async function deleteApiToken(projectId: string, tokenId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.$transaction(async (tx) => {
      // 1. Ambil data dulu untuk log (sebelum dihapus)
      const token = await tx.apiToken.findUnique({ where: { id: tokenId } });
      
      if (token) {
        // 2. Hapus Token
        await tx.apiToken.delete({
          where: { id: tokenId, projectId: projectId }, 
        });

        // 3. Catat Log
        await tx.activityLog.create({
          data: {
            action: "DELETE_API_TOKEN",
            entityType: "ApiToken",
            entityId: tokenId,
            entityName: token.name,
            userId: session.user.id!,
            projectId: projectId,
          }
        });
      }
    });

    revalidatePath(`/builder/${projectId}/settings/api-integration`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting API Token:", error);
    return { success: false, error: "Failed to delete token" };
  }
}

/**
 * Mengambil List API Tokens
 */
export async function getApiTokens(projectId: string) {
  try {
    const tokens = await prisma.apiToken.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: tokens };
  } catch (error) {
    return { success: false, data: [] };
  }
}


// ============================================================================
// 2. WORKFLOW APPROVAL ACTIONS
// ============================================================================

/**
 * Helper: Mengambil Daftar Role untuk Dropdown
 */
export async function getProjectRoles(projectId: string) {
  try {
    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { projectId: projectId }, 
          { projectId: null }       
        ]
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: roles };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/**
 * Helper: Mengambil Daftar Content Type untuk Dropdown
 */
export async function getContentTypes(projectId: string) {
  try {
    const types = await prisma.builderContentType.findMany({
      where: { projectId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: types };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/**
 * Membuat Workflow Approval Baru + Steps + Log
 */
export async function createWorkflow(projectId: string, data: {
  name: string;
  description: string;
  contentType: string; 
  steps: { name: string; roleId: string }[]; 
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.$transaction(async (tx) => {
      
      // 1. Buat Header Workflow
      const workflow = await tx.workflow.create({
        data: {
          name: data.name,
          description: data.description,
          projectId: projectId,
          isActive: true,
        }
      });

      // 2. Hubungkan ke Content Type (Jika dipilih)
      if (data.contentType) {
        const targetContentType = await tx.builderContentType.findFirst({
            where: { projectId, name: data.contentType }
        });

        if (targetContentType) {
            await tx.builderContentType.update({
            where: { id: targetContentType.id },
            data: { workflowId: workflow.id, hasWorkflow: true }
            });
        }
      }

      // 3. Buat Steps
      for (let i = 0; i < data.steps.length; i++) {
        const step = data.steps[i];
        
        await tx.workflowStep.create({
          data: {
            name: step.name,
            order: i + 1,
            workflowId: workflow.id,
            roleId: step.roleId || null, 
          }
        });
      }

      // 4. Catat Activity Log
      await tx.activityLog.create({
        data: {
          action: "CREATE_WORKFLOW",
          entityType: "Workflow",
          entityId: workflow.id,
          entityName: workflow.name,
          userId: session.user.id!,
          projectId: projectId,
          details: { 
            stepsCount: data.steps.length,
            appliedTo: data.contentType || "None"
          }
        }
      });

    });

    revalidatePath(`/builder/${projectId}/settings/workflow`);
    return { success: true };

  } catch (error) {
    console.error("Error creating Workflow:", error);
    return { success: false, error: "Failed to create workflow" };
  }
}

/**
 * Mengambil List Workflow
 */
export async function getWorkflows(projectId: string) {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { projectId },
      include: {
        steps: true,
        appliedContentTypes: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: workflows };
  } catch (error) {
    return { success: false, data: [] };
  }
}

/**
 * Menghapus Workflow + Log
 */
export async function deleteWorkflow(projectId: string, workflowId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await prisma.$transaction(async (tx) => {
      // 1. Ambil nama dulu untuk log
      const workflow = await tx.workflow.findUnique({ where: { id: workflowId } });

      if (workflow) {
        // 2. Hapus Workflow
        await tx.workflow.delete({
          where: { id: workflowId, projectId },
        });

        // 3. Catat Log
        await tx.activityLog.create({
          data: {
            action: "DELETE_WORKFLOW",
            entityType: "Workflow",
            entityId: workflowId,
            entityName: workflow.name,
            userId: session.user.id!,
            projectId: projectId,
          }
        });
      }
    });

    revalidatePath(`/builder/${projectId}/settings/workflow`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete workflow" };
  }
}

// ============================================================================
// 3. ACTIVITY LOG ACTIONS
// ============================================================================

/**
 * Mengambil Data Activity Log Project
 */
export async function getProjectActivityLogs(projectId: string) {
  try {
    const logs = await prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: {
          select: { name: true, email: true, image: true } 
        }
      },
      orderBy: { createdAt: 'desc' }, 
      take: 50 
    });
    return { success: true, data: logs };
  } catch (error) {
    return { success: false, data: [] };
  }
}