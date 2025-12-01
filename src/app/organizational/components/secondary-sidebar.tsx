"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function SecondarySidebar() {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;

  // Helper untuk cek link aktif
  const isActive = (path: string) => {
    // Jika path kosong (halaman utama [slug]), cek apakah pathname berakhir dengan slug
    if (path === "") return pathname === `/organizational/${slug}`;
    return pathname.includes(path);
  };

  const navItems = [
    { name: "Projects", path: "" }, // Link ke root [slug]
    { name: "Collaborator", path: "/collaborator" },
    { name: "Setting", path: "/setting" },
  ];

  return (
    <div className="w-64 border-r border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex flex-col h-full pt-6">
      <div className="px-6 mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </h2>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={`/organizational/${slug}${item.path}`}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.path)
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
