'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

// ============================================================================
// 1. API INTEGRATION ACTIONS
// ============================================================================

/**
 * Membuat API Token baru
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

    // 1. Generate Token Rahasia (Contoh: wf_sk_12345...)
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
    // Jika "Forever", expiresAt tetap null

    // 3. Simpan ke Database
    await prisma.apiToken.create({
      data: {
        name: formData.name,
        description: formData.description,
        token: secretToken,
        scope: formData.scope,
        permissions: formData.permissions, // JSON object dari frontend
        expiresAt: expiresAt,
        projectId: projectId,
      },
    });

    // 4. Refresh Halaman List
    revalidatePath(`/builder/${projectId}/settings/api-integration`);
    return { success: true };

  } catch (error) {
    console.error("Error creating API Token:", error);
    return { success: false, error: "Failed to create token" };
  }
}

/**
 * Menghapus API Token
 */
export async function deleteApiToken(projectId: string, tokenId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Pastikan token milik project yang benar
    await prisma.apiToken.delete({
      where: { 
        id: tokenId, 
        projectId: projectId 
      }, 
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
 * Membuat Workflow Approval Baru dengan Steps
 */
export async function createWorkflow(projectId: string, data: {
  name: string;
  description: string;
  contentType: string; // Nama content type (e.g., "Blog Post")
  steps: { name: string; assignee: string }[];
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Gunakan Transaction agar Workflow Header dan Steps tersimpan atomic (sekaligus)
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

      // 2. Cari ContentType berdasarkan nama (opsional, jika ingin link relasi)
      // Di form frontend Anda menggunakan nama string, kita bisa cari ID-nya jika perlu
      // Untuk sekarang, kita simpan relasi nanti jika skema mendukung string langsung
      // Atau abaikan jika hanya simulasi. Tapi di schema ada `appliedContentTypes`.
      
      // -- LOGIKA MENGHUBUNGKAN KE CONTENT TYPE --
      const targetContentType = await tx.builderContentType.findFirst({
        where: { projectId, name: data.contentType }
      });

      if (targetContentType) {
        await tx.builderContentType.update({
          where: { id: targetContentType.id },
          data: { workflowId: workflow.id, hasWorkflow: true }
        });
      }

      // 3. Buat Steps (Looping array dari form)
      for (let i = 0; i < data.steps.length; i++) {
        const step = data.steps[i];
        
        // Cari Role ID berdasarkan nama Role yang dipilih di dropdown
        // (Misal: "Editor", "Legal Team")
        let roleId = null;
        if (step.assignee) {
            const role = await tx.role.findFirst({
                where: { 
                  name: step.assignee, 
                  // Cari role global (projectId null) ATAU role project ini
                  OR: [
                    { projectId: projectId },
                    { projectId: null } 
                  ]
                }
            });
            roleId = role?.id;
        }

        // Simpan Step
        await tx.workflowStep.create({
          data: {
            name: step.name,
            order: i + 1, // Urutan step: 1, 2, 3...
            workflowId: workflow.id,
            roleId: roleId, 
          }
        });
      }
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
        steps: true, // Ambil juga detail steps-nya untuk dihitung jumlahnya
        appliedContentTypes: {
          select: { name: true } // Ambil nama content type yang pakai workflow ini
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
 * Menghapus Workflow
 */
export async function deleteWorkflow(projectId: string, workflowId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Hapus workflow (Cascade delete akan menghapus steps juga otomatis)
    await prisma.workflow.delete({
      where: { id: workflowId, projectId },
    });

    revalidatePath(`/builder/${projectId}/settings/workflow`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete workflow" };
  }
}