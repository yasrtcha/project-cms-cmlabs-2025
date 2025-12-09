"use client";

import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  interval: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonStyle: "primary" | "secondary" | "contact";
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free / Demo",
    price: 0,
    currency: "USD",
    interval: "month",
    description: "Suitable for individuals to demo and explore cmlabs CMS",
    buttonText: "Get Started",
    buttonStyle: "primary",
    features: [
      "1 User",
      "3 Personal Projects",
      "500K / month API calls",
      "100 file media assets",
      "SEO Integrated",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 150,
    currency: "USD",
    interval: "month",
    description: "Ideal for growing teams with full access only granted to pro users.",
    buttonText: "Purchase",
    buttonStyle: "secondary",
    popular: true,
    features: [
      "10 User for organization (Host Pro)",
      "50 Personal Projects",
      "10 Organization (20 Projects)",
      "5 Million / month API calls",
      "5000 file media assets",
      "SEO Integrated",
      "AI Assistance",
      "Custom Domain",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 500,
    currency: "USD",
    interval: "month",
    description: "Suitable for companies needing scalability, advanced features, and smooth collaboration.",
    buttonText: "Purchase",
    buttonStyle: "secondary",
    features: [
      "50 User for organization (all users)",
      "Unlimited Personal Projects",
      "50 Organization (100 Projects)",
      "10 Million / month API calls",
      "unlimited file media assets",
      "SEO Integrated",
      "AI Assistance",
      "Custom Domain",
    ],
  },
  {
    id: "white-label",
    name: "White Label",
    price: null,
    currency: "USD",
    interval: "month",
    description: "Take full ownership of the CMS platform, deploy it under your infrastructure, with your own branding and configurations.",
    buttonText: "Contact us",
    buttonStyle: "contact",
    features: [
      "Full Source Code Access",
      "Fully Configurable Modules",
      "Custom Branding",
      "CMS Ownership",
      "Lifetime licence",
    ],
  },
];

interface ChoosePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChoosePlanModal({ isOpen, onClose }: ChoosePlanModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelectPlan = (plan: Plan) => {
    if (plan.buttonStyle === "contact") {
      // Open contact page or email
      window.open("mailto:sales@cmlabs.com", "_blank");
    } else if (plan.price === 0) {
      // Free plan - just close modal
      onClose();
    } else {
      // Paid plan - go to checkout
      router.push(`/dashboard/billing/checkout?plan=${plan.id}`);
      onClose();
    }
  };

  const getButtonStyle = (style: string) => {
    switch (style) {
      case "primary":
        return "bg-[#3A7AC3] hover:bg-blue-600 text-white";
      case "secondary":
        return "bg-[#1E3A5F] hover:bg-[#2a4a73] text-white";
      case "contact":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Plan
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a plan that suits your project
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-700 rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                  plan.popular
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200 dark:border-slate-600"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        / {plan.interval}
                      </span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      Custom
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[60px]">
                  {plan.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors mb-6 ${getButtonStyle(
                    plan.buttonStyle
                  )}`}
                >
                  {plan.buttonText}
                </button>

                {/* Features */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Included Features
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check
                          size={16}
                          className="text-green-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Read all details */}
                <button className="mt-4 text-sm text-[#3A7AC3] hover:underline">
                  Read all details →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
