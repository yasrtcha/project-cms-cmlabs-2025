"use client";

import { useState } from "react";
import { CreditCard, Wallet, Plus, Trash2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "ewallet";
  provider: string;
  displayName: string;
  isDefault: boolean;
}

// Mock data - will be replaced with API data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "credit_card",
    provider: "Visa",
    displayName: "**** **** **** 4563",
    isDefault: true,
  },
  {
    id: "2",
    type: "ewallet",
    provider: "Dana",
    displayName: "089*******78",
    isDefault: false,
  },
];

export function PaymentInformation() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "credit_card":
        return <CreditCard className="w-5 h-5" />;
      case "ewallet":
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "visa":
        return "bg-orange-100 text-orange-600";
      case "mastercard":
        return "bg-red-100 text-red-600";
      case "dana":
        return "bg-blue-100 text-blue-600";
      case "ovo":
        return "bg-purple-100 text-purple-600";
      case "gopay":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Payment Information
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700 last:border-0"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getProviderColor(method.provider)}`}>
                {getIcon(method.type)}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.type === "credit_card" ? "Credit Card" : `E-wallet (${method.provider})`}
                  </span>
                  {method.isDefault && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  : {method.displayName}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDelete(method.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
              <button className="text-[#3A7AC3] hover:text-blue-700 text-sm font-medium">
                {method.type === "credit_card" ? "Change Credit Card" : `Change ${method.provider}`}
              </button>
            </div>
          </div>
        ))}

        {/* Add Payment Method Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3A7AC3] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Payment Method
        </button>
      </div>

      {/* Add Payment Modal - Simple placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Payment Method
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This feature will be integrated with Xendit payment gateway.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
