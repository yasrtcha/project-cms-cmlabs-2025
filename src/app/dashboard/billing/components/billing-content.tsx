"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InformationPackage } from "./information-package";
import { SystemUsageOverview } from "./system-usage-overview";
import { BillingAddress } from "./billing-address";
import { PaymentInformation } from "./payment-information";
import { DetailProjectUsage } from "./detail-project-usage";
import { BillingHistory } from "./billing-history";
import { ChoosePlanModal } from "./choose-plan-modal";

export function BillingContent() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const searchParams = useSearchParams();
  const [hasPlan, setHasPlan] = useState(searchParams.get("success") === "true");
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setHasPlan(true);
    }
  }, [searchParams]);

  // Extract data from URL
  const userData = {
    planId: searchParams.get("planId") || "professional",
    fullName: searchParams.get("fullName"),
    email: searchParams.get("email"),
    country: searchParams.get("country"),
    city: searchParams.get("city"),
    zipCode: searchParams.get("zipCode"),
    state: searchParams.get("state"),
    address: searchParams.get("address"),
    company: searchParams.get("company"),
  };

  const handlePlanSelection = (plan: any) => {
    router.push(`/dashboard/billing/checkout?plan=${plan.id}`);
  };

  if (!hasPlan) {
    return (
      <div className="p-6 lg:p-10 space-y-8 bg-[#F8FAFC] dark:bg-slate-900 min-h-screen">
        <div className="inline-flex items-center px-6 py-2.5 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg shadow-sm">
          <span className="text-[11px] font-bold text-[#3A7AC3] uppercase tracking-wider">Dashboard / Pages / </span>
          <span className="text-[11px] font-black text-slate-800 dark:text-white ml-2 uppercase tracking-wider">Plan and Billing</span>
        </div>

        <div className="max-w-[1400px] mx-auto">
          <ChoosePlanModal
            mode="inline"
            onPlanSelected={handlePlanSelection}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#F8FAFC] dark:bg-slate-900 min-h-screen">
      {/* Breadcrumb Box */}
      <div className="inline-flex items-center px-6 py-2.5 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg shadow-sm">
        <span className="text-[11px] font-bold text-[#3A7AC3] uppercase tracking-wider">Dashboard / Pages / </span>
        <span className="text-[11px] font-black text-slate-800 dark:text-white ml-2 uppercase tracking-wider">Plan and Billing</span>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Plan and Billing
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InformationPackage
            planId={userData.planId}
            onUpgrade={() => setShowPlanModal(true)}
          />
          <SystemUsageOverview />
        </div>

        <div className="space-y-8">
          <BillingAddress addressData={userData} />
          {userData.planId !== "free" && <PaymentInformation />}
          <DetailProjectUsage />
          <BillingHistory />
        </div>
      </div>

      {showPlanModal && (
        <ChoosePlanModal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onPlanSelected={handlePlanSelection}
        />
      )}
    </div>
  );
}
