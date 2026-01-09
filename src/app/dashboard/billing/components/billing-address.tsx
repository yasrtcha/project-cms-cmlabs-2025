"use client";

import { useState, useEffect } from "react";
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
  company: "CMLABS",
};

interface BillingAddressProps {
  addressData?: any;
}

export function BillingAddress({ addressData }: BillingAddressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(mockBillingAddress);

  useEffect(() => {
    // Only update if addressData is provided (meaning we might be coming from checkout)
    if (addressData && addressData.fullName !== null) {
      setFormData({
        fullName: addressData.fullName ?? mockBillingAddress.fullName,
        email: addressData.email ?? mockBillingAddress.email,
        country: addressData.country ?? mockBillingAddress.country,
        city: addressData.city ?? mockBillingAddress.city,
        state: addressData.state ?? mockBillingAddress.state,
        zipCode: addressData.zipCode ?? mockBillingAddress.zipCode,
        address: addressData.address ?? mockBillingAddress.address,
        company: addressData.company ?? mockBillingAddress.company,
      });
    }
  }, [addressData]);

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
      <div className="p-8">
        <div className="space-y-4">
          {/* Row 1: Full Name */}
          <div className="flex items-center">
            <label className="w-40 text-sm font-bold text-slate-800 dark:text-slate-200">
              Full Name
            </label>
            <span className="text-slate-400 mr-8">:</span>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {formData.fullName}
            </div>
          </div>

          {/* Row 2: Billing Email */}
          <div className="flex items-center">
            <label className="w-40 text-sm font-bold text-slate-800 dark:text-slate-200">
              Billing Email
            </label>
            <span className="text-slate-400 mr-8">:</span>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {formData.email}
            </div>
          </div>

          {/* Row 3: Country */}
          <div className="flex items-center">
            <label className="w-40 text-sm font-bold text-slate-800 dark:text-slate-200">
              Country
            </label>
            <span className="text-slate-400 mr-8">:</span>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {formData.country}
            </div>
          </div>

          {/* Row 4: City & ZIP */}
          <div className="flex items-center gap-6">
            <div className="flex-1 flex items-center">
              <label className="w-40 text-sm font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                City
              </label>
              <span className="text-slate-400 mr-8">:</span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {formData.city}
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <label className="w-16 text-sm font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                ZIP
              </label>
              <span className="text-slate-400 mr-4">:</span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {formData.zipCode}
              </div>
            </div>
          </div>

          {/* Row 5: State & Address */}
          <div className="flex items-center gap-6">
            <div className="flex-1 flex items-center">
              <label className="w-40 text-sm font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                State / Province
              </label>
              <span className="text-slate-400 mr-8">:</span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {formData.state}
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <label className="w-16 text-sm font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                Address
              </label>
              <span className="text-slate-400 mr-4">:</span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {formData.address}
              </div>
            </div>
          </div>

          {/* Row 6: Company */}
          <div className="flex items-center">
            <label className="w-40 text-sm font-bold text-slate-800 dark:text-slate-200">
              Company (Optional)
            </label>
            <span className="text-slate-400 mr-8">:</span>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 px-4 py-2 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {formData.company}
            </div>
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
