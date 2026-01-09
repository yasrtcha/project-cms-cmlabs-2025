"use client";

import { useState } from "react";
import { InformationPackage } from "./information-package";
import { SystemUsageOverview } from "./system-usage-overview";
import { BillingAddress } from "./billing-address";
import { PaymentInformation } from "./payment-information";
import { DetailProjectUsage } from "./detail-project-usage";
import { BillingHistory } from "./billing-history";
import { ChoosePlanModal } from "./choose-plan-modal";

export function BillingContent() {
  const [showPlanModal, setShowPlanModal] = useState(false);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span className="text-[#3A7AC3]">Dashboard</span> / Pages /{" "}
        <span className="font-semibold text-gray-900 dark:text-white">Plan and Billing</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan and Billing</h1>

      {/* Top Section: Information Package & System Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InformationPackage onUpgrade={() => setShowPlanModal(true)} />
        <SystemUsageOverview />
      </div>

      {/* Billing Address */}
      <BillingAddress />

      {/* Payment Information */}
      <PaymentInformation />

      {/* Detail Project Usage */}
      <DetailProjectUsage />

      {/* Billing History */}
      <BillingHistory />

      {/* Choose Plan Modal */}
      <ChoosePlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
      />
    </div>
  );
}
