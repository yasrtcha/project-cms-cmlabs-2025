"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface InformationPackageProps {
  planId?: string;
  onUpgrade: () => void;
}

const plansMap: Record<string, any> = {
  free: {
    name: "Free / Demo",
    price: 0,
    status: "active",
    subscriptionEndDate: "No Expiry",
  },
  professional: {
    name: "Professional Plan",
    price: 2000000,
    status: "active",
    subscriptionEndDate: "12 Dec 2025",
  },
  enterprise: {
    name: "Enterprise Plan",
    price: 7500000,
    status: "active",
    subscriptionEndDate: "12 Dec 2025",
  },
};

export function InformationPackage({ planId = "professional", onUpgrade }: InformationPackageProps) {
  const currentPlan = plansMap[planId] || plansMap.professional;
  const [autoRenewal, setAutoRenewal] = useState(true);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-[#3A7AC3] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
            Active
          </span>
        );
      default:
        return (
          <span className="bg-gray-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden flex flex-col items-stretch h-full">
      {/* Header */}
      <div className="bg-[#F1F5F9] dark:bg-slate-700/50 px-6 py-2 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Information Package
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentPlan.name}
              </h3>
              {getStatusBadge(currentPlan.status)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRenewal(!autoRenewal)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${autoRenewal
                  ? "bg-white border-slate-400"
                  : "bg-white border-slate-300"
                  }`}
              >
                {autoRenewal && <div className="w-2.5 h-2.5 bg-slate-600 rounded-sm" />}
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Auto Renewal
              </span>
            </div>

            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight max-w-[220px]">
              Enable to automatically renew your subscription at the end of each billing cycle using your saved payment method.
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-6">
              Subscription end date <span className="text-blue-400 font-bold">{currentPlan.subscriptionEndDate}</span>
            </p>
            <div className="text-5xl font-bold text-slate-800 dark:text-white tracking-tighter">
              Rp {currentPlan.price.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-wrap gap-3 pt-4">
          <button className="px-5 py-2 bg-[#A0AEC0] text-white text-[10px] font-bold rounded-lg hover:bg-slate-500 transition-all uppercase tracking-wider">
            Pay package
          </button>
          <button
            onClick={onUpgrade}
            className="px-5 py-2 bg-[#68D391] text-white text-[10px] font-bold rounded-lg hover:bg-green-500 transition-all uppercase tracking-wider"
          >
            Upgrade Package
          </button>
          <button className="px-5 py-2 bg-[#F56565] text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all uppercase tracking-wider">
            Cancel Package
          </button>
        </div>
      </div>
    </div>
  );
}
