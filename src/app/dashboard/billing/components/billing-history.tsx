"use client";

import { Download } from "lucide-react";

interface Invoice {
  id: string;
  plan: string;
  datePaid: string;
  nominal: number;
  currency: string;
  status: "active" | "complete" | "pending" | "failed";
  invoiceUrl?: string;
}

// Mock data - will be replaced with API data
const mockInvoices: Invoice[] = [
  {
    id: "inv_001",
    plan: "Professional",
    datePaid: "12 Dec 2025",
    nominal: 100,
    currency: "USD",
    status: "active",
  },
  {
    id: "inv_002",
    plan: "Professional",
    datePaid: "12 Nov 2025",
    nominal: 100,
    currency: "USD",
    status: "complete",
    invoiceUrl: "#",
  },
  {
    id: "inv_003",
    plan: "Professional",
    datePaid: "12 Oct 2025",
    nominal: 100,
    currency: "USD",
    status: "complete",
    invoiceUrl: "#",
  },
];

export function BillingHistory() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Active
          </span>
        );
      case "complete":
        return (
          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Complete
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            Failed
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
          Billing History
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                Plan
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                Date Paid
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                Nominal
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {mockInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {invoice.plan}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {invoice.datePaid}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                  ${invoice.nominal}
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  {invoice.invoiceUrl ? (
                    <a
                      href={invoice.invoiceUrl}
                      className="inline-flex items-center gap-1 text-[#3A7AC3] hover:text-blue-700 text-sm font-medium"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {mockInvoices.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No billing history yet.</p>
        </div>
      )}
    </div>
  );
}
