"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface InformationPackageProps {
  onUpgrade: () => void;
}

// Mock data - will be replaced with API data
const mockSubscription = {
  plan: "Professional",
  status: "active",
  price: 150,
  currency: "USD",
  subscriptionEndDate: "12 Dec 2025",
  autoRenewal: true,
};

export function InformationPackage({ onUpgrade }: InformationPackageProps) {
  const [autoRenewal, setAutoRenewal] = useState(mockSubscription.autoRenewal);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        );
      case "expired":
        return (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Expired
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Information Package
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {mockSubscription.plan}
              </h3>
              {getStatusBadge(mockSubscription.status)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Subscription end date{" "}
              <span className="text-blue-500">{mockSubscription.subscriptionEndDate}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              ${mockSubscription.price}
            </div>
          </div>
        </div>

        {/* Auto Renewal */}
        <div className="flex items-start gap-3 mb-6">
          <button
            onClick={() => setAutoRenewal(!autoRenewal)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              autoRenewal
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300 dark:border-slate-600"
            }`}
          >
            {autoRenewal && <Check size={14} className="text-white" />}
          </button>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Auto Renewal
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable to automatically renew your subscription at the end of each billing cycle using your saved payment method.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
            Pay package
          </button>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upgrade Package
          </button>
          <button className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
            Cancel Package
          </button>
        </div>
      </div>
    </div>
  );
}
