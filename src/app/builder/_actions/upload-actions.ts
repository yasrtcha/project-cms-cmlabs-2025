'use server'

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Buat nama file unik (biar gak bentrok kalau nama sama)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + file.name.split('.').pop();
    
    // 2. Tentukan lokasi simpan (di folder public/uploads)
    const uploadDir = join(process.cwd(), "public/uploads");
    
    // Buat folder jika belum ada
    await mkdir(uploadDir, { recursive: true });

    const path = join(uploadDir, filename);

    // 3. Simpan file fisik
    await writeFile(path, buffer);

    // 4. Return URL yang bisa diakses browser
    // Karena disimpan di "public", aksesnya langsung via slash "/"
    const fileUrl = `/uploads/${filename}`;

    return { success: true, url: fileUrl };

  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}