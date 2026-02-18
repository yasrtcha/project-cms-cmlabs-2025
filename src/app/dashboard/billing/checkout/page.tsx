"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { X, ChevronRight, Minus, Plus, Check, CreditCard, Building2, Wallet, Store, Clock, QrCode } from "lucide-react";
import Link from "next/link";

// Plan data
const plansData: Record<string, { name: string; price: number; currency: string }> = {
  free: { name: "Free / Demo", price: 0, currency: "Rupiah" },
  professional: { name: "Professional Plan", price: 2000000, currency: "Rupiah" },
  enterprise: { name: "Enterprise Plan", price: 7500000, currency: "Rupiah" },
};

// Payment methods
const paymentMethods = [
  { id: "credit_card", name: "Credit Card", icon: CreditCard, description: "Visa, Mastercard, JCB" },
  { id: "virtual_account", name: "Virtual Account", icon: Building2, description: "BCA, BNI, BRI, Mandiri" },
  { id: "ewallet", name: "E-wallet", icon: Wallet, description: "OVO, DANA, GoPay, ShopeePay" },
  { id: "retail", name: "Retail", icon: Store, description: "Alfamart, Indomaret" },
  { id: "paylater", name: "Paylater", icon: Clock, description: "Kredivo, Akulaku" },
  { id: "qris", name: "QRIS", icon: QrCode, description: "Scan QR to pay" },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "professional";
  const plan = plansData[planId] || plansData.professional;

  const [months, setMonths] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Billing address form
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
    company: "",
  });

  const subtotal = plan.price * months;
  const total = subtotal;

  const handleChange = (field: string, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePurchase = async () => {
    // For paid plans, require payment method. For free, only terms.
    const canProceed = plan.price === 0 ? agreedToTerms : (selectedPayment && agreedToTerms);
    if (!canProceed) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect with data
    const addressParams = new URLSearchParams({
      success: "true",
      planId: planId,
      fullName: billingAddress.fullName,
      email: billingAddress.email,
      country: billingAddress.country,
      city: billingAddress.city,
      zipCode: billingAddress.zipCode,
      state: billingAddress.state,
      address: billingAddress.address,
      company: billingAddress.company,
    }).toString();

    if (plan.price === 0) {
      alert("Free plan activated successfully!");
    } else {
      alert("Payment integration with Xendit will be implemented here!");
    }

    router.push(`/dashboard/billing?${addressParams}`);
    setLoading(false);
  };

  const isFormValid = () => {
    const isBillingValid =
      billingAddress.fullName &&
      billingAddress.email &&
      billingAddress.country &&
      billingAddress.city &&
      billingAddress.address &&
      agreedToTerms;

    if (plan.price === 0) return isBillingValid;
    return isBillingValid && selectedPayment;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Checkout
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Complete your checkout to activate your plan
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Billing Address & Payment Methods */}
              <div className="lg:col-span-2 space-y-6">
                {/* Billing Address */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Billing Address
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={billingAddress.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Email Billing <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={billingAddress.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Philippines">Philippines</option>
                      </select>
                    </div>

                    {/* City & ZIP */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          ZIP
                        </label>
                        <input
                          type="text"
                          value={billingAddress.zipCode}
                          onChange={(e) => handleChange("zipCode", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>

                    {/* State & Address */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          value={billingAddress.state}
                          onChange={(e) => handleChange("state", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State / Province"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={billingAddress.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={billingAddress.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Methods - Only show for paid plans */}
                {plan.price > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-gray-200 dark:border-slate-700">
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Payment Method
                      </h2>
                    </div>
                    <div className="p-6 space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${selectedPayment === method.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-10 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-white uppercase">Logo</span>
                            </div>
                            <div className="text-left font-sans">
                              <p className="font-bold text-slate-800 dark:text-white text-base">
                                {method.name}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400" size={24} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {plan.price === 0 && (
                  <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Note: You are activating the Free / Demo plan. No payment method is required. Please verify your billing address details to continue.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden sticky top-6">
                  <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Plan */}
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {plan.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Rp {plan.price.toLocaleString('id-ID')} / month
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Rp {plan.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Months */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-slate-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Month</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setMonths(Math.max(1, months - 1))}
                          className="w-8 h-8 rounded-lg border border-gray-300 dark:text-white dark:border-slate-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                          {months}
                        </span>
                        <button
                          onClick={() => setMonths(months + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 dark:text-white dark:border-slate-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between py-3 border-t border-gray-200 dark:border-slate-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between py-3 border-t border-gray-200 dark:border-slate-700">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Next Charge */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Next Charge on{" "}
                      {new Date(
                        Date.now() + months * 30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {/* Terms */}
                    <div className="flex items-start gap-3 pt-4">
                      <button
                        onClick={() => setAgreedToTerms(!agreedToTerms)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${agreedToTerms
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300 dark:border-slate-600"
                          }`}
                      >
                        {agreedToTerms && <Check size={14} className="text-white" />}
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        I agree to the{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                          Terms of Use
                        </a>{" "}
                        and acknowledge the{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={handlePurchase}
                      disabled={!isFormValid() || loading}
                      className="w-full py-4 bg- hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                    >
                      {loading
                        ? "Processing..."
                        : plan.price === 0
                          ? "Activate Plan"
                          : "Purchase"
                      }
                    </button>

                    {/* Back Link */}
                    <Link
                      href="/dashboard/billing"
                      className="block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ← Back to Billing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
