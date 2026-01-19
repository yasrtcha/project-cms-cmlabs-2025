'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- 1. FUNGSI UNTUK MEMBUAT HALAMAN BARU ---
export async function createNewPage(data: { name: string, slug: string, projectId: string, hasSeo?: boolean }) {
  try {
    const page = await prisma.builderContentType.create({
      data: {
        name: data.name,
        slug: data.slug,
        projectId: data.projectId,
        type: "SINGLE", // Gunakan uppercase agar konsisten dengan create-type-modal
        hasSeo: data.hasSeo || false,
      }
    })

    // Memperbarui data sidebar secara otomatis
    revalidatePath(`/builder/${data.projectId}`)

    return { success: true, page }
  } catch (error) {
    console.error("Gagal membuat halaman di database:", error)
    return { success: false }
  }
}

// --- 3. FUNGSI UNTUK MENGUPDATE NAMA HALAMAN ---
export async function updatePageName(pageId: string, name: string, projectId: string) {
  try {
    await prisma.builderContentType.update({
      where: { id: pageId },
      data: { name }
    })

    revalidatePath(`/builder/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Gagal update nama halaman:", error)
    return { success: false }
  }
}

// --- 2. FUNGSI UNTUK MENGHAPUS HALAMAN ---
export async function deletePage(pageId: string, projectId: string) {
  try {
    // Menghapus data berdasarkan ID unik dari PostgreSQL
    await prisma.builderContentType.delete({
      where: {
        id: pageId,
      },
    })

    // Refresh data di sidebar agar nama halaman yang dihapus langsung hilang
    revalidatePath(`/builder/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error("Gagal menghapus halaman:", error)
    return { success: false }
  }
}