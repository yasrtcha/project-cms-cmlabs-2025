'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

// Fungsi Generate Token Unik
function generateToken() {
  return 'cm_' + crypto.randomBytes(16).toString('hex');
}

export async function createApiToken(data: {
  name: string;
  description?: string;
  role: string; // 'public', 'read_write', 'full'
  expiresIn?: string; // '7days', '30days', 'never'
  projectId: string;
}) {
  try {
    // 1. Hitung Tanggal Kadaluarsa
    let expiresAt = null;
    if (data.expiresIn === '7days') {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else if (data.expiresIn === '30days') {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    // 2. Simpan ke Database
    const newToken = await prisma.apiToken.create({
      data: {
        name: data.name,
        description: data.description,
        token: generateToken(),
        role: data.role,
        expiresAt: expiresAt,
        projectId: data.projectId
      }
    });

    revalidatePath(`/builder/${data.projectId}/api-integration`);
    return { success: true, token: newToken.token }; // Return token agar bisa dicopy user
  } catch (error) {
    console.error("Create Token Error:", error);
    return { success: false, error: "Failed to create token" };
  }
}

export async function deleteApiToken(tokenId: string, projectId: string) {
  try {
    await prisma.apiToken.delete({ where: { id: tokenId } });
    revalidatePath(`/builder/${projectId}/api-integration`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}