"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

// Mock data - will be replaced with API data
const mockBillingAddress = {
  fullName: "Afrizal Dwi Septian",
  email: "cmlabs@gmail.com",
  country: "Indonesia",
  city: "Malang",
  state: "East Java",
  zipCode: "6748453",
  address: "Candi V streets no.687",
  company: "East Java",
};

export function BillingAddress() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(mockBillingAddress);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const InputField = ({ value, field }: { value: string; field: string }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => handleChange(field, e.target.value)}
      className="flex-1 px-3 py-1.5 border-b border-gray-300 dark:border-slate-600 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
    />
  );

  const DisplayValue = ({ value, muted = false }: { value: string; muted?: boolean }) => (
    <span className={`text-sm ${muted ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
      {value}
    </span>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Billing Address
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Row 1: Full Name */}
          <div className="flex items-center">
            <label className="w-44 text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
              Full Name
            </label>
            <span className="text-gray-400 mx-3">:</span>
            {isEditing ? (
              <InputField value={formData.fullName} field="fullName" />
            ) : (
              <DisplayValue value={formData.fullName} />
            )}
          </div>

          {/* Row 2: Billing Email */}
          <div className="flex items-center">
            <label className="w-44 text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
              Billing Email
            </label>
            <span className="text-gray-400 mx-3">:</span>
            {isEditing ? (
              <InputField value={formData.email} field="email" />
            ) : (
              <DisplayValue value={formData.email} muted />
            )}
          </div>

          {/* Row 3: Country */}
          <div className="flex items-center">
            <label className="w-44 text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
              Country
            </label>
            <span className="text-gray-400 mx-3">:</span>
            {isEditing ? (
              <InputField value={formData.country} field="country" />
            ) : (
              <DisplayValue value={formData.country} />
            )}
          </div>

          {/* Row 4: City & ZIP */}
          <div className="flex items-center">
            <label className="w-44 text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
              City
            </label>
            <span className="text-gray-400 mx-3">:</span>
            <div className="flex-1 flex items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-48 px-3 py-1.5 border-b border-gray-300 dark:border-slate-600 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span className="w-48 text-sm text-gray-900 dark:text-white">{formData.city}</span>
              )}
              
              <label className="text-sm font-medium text-gray-900 dark:text-white ml-8">
                ZIP
              </label>
              <span className="text-gray-400 mx-3">:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  className="w-32 px-3 py-1.5 border-b border-gray-300 dark:border-slate-600 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span className="text-sm text-gray-900 dark:text-white">{formData.zipCode}</span>
              )}
            </div>
          </div>

          {/* Row 5: State / Province & Address */}
          <div className="flex items-center">
            <label className="w-44 text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
              State / Province
            </label>
            <span className="text-gray-400 mx-3">:</span>
            <div className="flex-1 flex items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-48 px-3 py-1.5 border-b border-gray-300 dark:border-slate-600 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span className="w-48 text-sm text-gray-900 dark:text-white">{formData.state}</span>
              )}
              
              <label className="text-sm font-medium text-gray-900 dark:text-white ml-8">
                Address
              </label>
              <span className="text-gray-400 mx-3">:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="flex-1 px-3 py-1.5 border-b border-gray-300 dark:border-slate-600 bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span className="text-sm text-gray-900 dark:text-white">{formData.address}</span>
              )}
            </div>
          </div>

          {/* Row 6: Company */}
          <div className="flex items-center">
            <label className="w-44 text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
              Company (Optional)
            </label>
            <span className="text-gray-400 mx-3">:</span>
            {isEditing ? (
              <InputField value={formData.company} field="company" />
            ) : (
              <DisplayValue value={formData.company} />
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              Update Information
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
