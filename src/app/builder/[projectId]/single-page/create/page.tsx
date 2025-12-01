"use client";

import { useState } from "react";

// Komponen Toggle (Switch) yang bisa digunakan ulang
const ToggleSection = ({
  title,
  description,
  isEnabled,
  onToggle,
}: {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}) => (
  <div className="mb-6">
    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <div className="flex items-start space-x-4">
      {/* Tombol Switch */}
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isEnabled ? "bg-[#3A7AC3]" : "bg-gray-300 dark:bg-slate-600"
        }`}>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isEnabled ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>

      {/* Deskripsi */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
        {description}
      </p>
    </div>
  </div>
);

export default function CreateSinglePage() {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  // State untuk Toggle di tab Advanced
  const [advancedSettings, setAdvancedSettings] = useState({
    multiLanguage: true, // Default ON (sesuai gambar)
    seo: false,
    workflow: false,
  });

  const toggleSetting = (key: keyof typeof advancedSettings) => {
    setAdvancedSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full w-full p-12 bg-white dark:bg-slate-950 overflow-y-auto">
      {/* Container Utama */}
      <div className="max-w-3xl">
        {/* Judul Halaman */}
        <h1 className="text-3xl font-bold text-[#3A7AC3] mb-8">
          Create Single Page
        </h1>

        {/* Tabs Navigation */}
        <div className="flex space-x-8 border-b border-gray-200 dark:border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab("basic")}
            className={`pb-2 text-sm font-semibold transition-colors relative ${
              activeTab === "basic"
                ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}>
            Basic Configuration
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`pb-2 text-sm font-semibold transition-colors relative ${
              activeTab === "advanced"
                ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}>
            Advanced Configuration
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-6">
          {/* ----- BASIC CONFIGURATION ----- */}
          {activeTab === "basic" && (
            <>
              {/* Page Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, About Us"
                  className="w-full p-3 bg-gray-200 dark:bg-slate-800 border-none rounded-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#3A7AC3] outline-none transition-all"
                />
              </div>

              {/* API Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Auto-generated"
                  className="w-full p-3 bg-gray-200 dark:bg-slate-800 border-none rounded-sm text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  its generated automatically and used to generate API routes
                </p>
              </div>
            </>
          )}

          {/* ----- ADVANCED CONFIGURATION (SESUAI GAMBAR BARU) ----- */}
          {activeTab === "advanced" && (
            <div className="space-y-2">
              <ToggleSection
                title="Multi Language"
                description="Enable this feature to make the page support multiple languages. When activated, the page content can be displayed in different languages based on user preference."
                isEnabled={advancedSettings.multiLanguage}
                onToggle={() => toggleSetting("multiLanguage")}
              />

              <ToggleSection
                title="SEO"
                description="Enable this feature to activate SEO settings for this page. When turned on, you can optimize the page content for search engines and customize metadata to improve visibility in search results."
                isEnabled={advancedSettings.seo}
                onToggle={() => toggleSetting("seo")}
              />

              <ToggleSection
                title="Workflow"
                description="Enable this feature to activate automated workflows for user interactions. When turned on, the system will automatically implement a structured approval process."
                isEnabled={advancedSettings.workflow}
                onToggle={() => toggleSetting("workflow")}
              />
            </div>
          )}

          {/* Create Button (Selalu muncul) */}
          <div className="pt-4">
            <button className="w-full bg-[#3A7AC3] hover:bg-blue-600 text-white font-medium py-3 rounded-md transition-colors shadow-sm">
              Create Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
