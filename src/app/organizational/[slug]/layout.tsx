"use client";

import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";
import { SecondarySidebar } from "../components/secondary-sidebar"; // Sidebar Kedua yg baru dibuat

export default function OrganizationalDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* 1. SIDEBAR UTAMA (Paling Kiri - Ikon) */}
      <Sidebar />

      {/* 2. SIDEBAR KEDUA (Tengah - Menu Teks) */}
      <SecondarySidebar />

      {/* 3. AREA KONTEN UTAMA (Kanan) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header di atas konten */}
        <Header />

        {/* Konten Halaman (Page.tsx akan dirender di sini) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
