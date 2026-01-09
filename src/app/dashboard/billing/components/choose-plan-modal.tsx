"use client";

import { X, Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: number | string | null;
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
    price: "0",
    currency: "Rupiah",
    interval: "month",
    description: "Suitable for individuals to demo and explore cmlabs CMS",
    buttonText: "Get Started",
    buttonStyle: "primary",
    features: [
      "1 User",
      "5 Personal Projects",
      "500K / month API calls",
      "100 file media assets",
      "SEO Integrated",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 2000000,
    currency: "Rupiah",
    interval: "month",
    description: "Ideal for growing teams with full access only granted to pro users.",
    buttonText: "Purchase",
    buttonStyle: "secondary",
    popular: false,
    features: [
      "Add 10 User for organization",
      "50 Personal Projects",
      "10 Organization (20 Projects)",
      "5 Million / month API calls",
      "5000 file media assets",
      "SEO Integrated",
      "Custom Domain",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 7500000,
    currency: "Rupiah",
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
      "Custom Domain",
    ],
  },
  {
    id: "white-label",
    name: "White Label",
    price: null,
    currency: "Rupiah",
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

interface ChoosePlanProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: "modal" | "inline";
  onPlanSelected?: (plan: Plan) => void;
}

export function ChoosePlan({
  isOpen = false,
  onClose,
  mode = "modal",
  onPlanSelected
}: ChoosePlanProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (mode === "inline") {
      setIsVisible(true);
      return;
    }

    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mode]);

  if (mode === "modal" && !isOpen && !isVisible) return null;

  const handleSelectPlan = (plan: Plan) => {
    if (onPlanSelected) {
      onPlanSelected(plan);
      return;
    }

    if (plan.buttonStyle === "contact") {
      window.open("mailto:sales@cmlabs.com", "_blank");
    } else if (plan.price === 0) {
      if (onClose) onClose();
    } else {
      router.push(`/dashboard/billing/checkout?plan=${plan.id}`);
      if (onClose) onClose();
    }
  };

  const Content = (
    <div className={`w-full ${mode === "modal" ? "p-8 lg:p-12" : ""}`}>
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
          Choose Your Plan
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Scale your content mastery with precision. Select a plan that aligns with your project goals.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch pt-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative group flex flex-col p-8 rounded-[2rem] border-2 transition-all duration-300 outline-none active:scale-[0.98] active:shadow-inner ${plan.popular
              ? "bg-[#0B1120] dark:bg-blue-900/40 border-blue-500/50 dark:border-blue-500 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.3)] scale-105 z-10"
              : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-blue-100 dark:hover:border-blue-900/30"
              }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-xl flex items-center gap-1.5 uppercase tracking-widest whitespace-nowrap">
                  <Star size={12} fill="currentColor" /> Most Popular
                </span>
              </div>
            )}

            {/* Plan Name */}
            <h3
              className={`text-2xl font-black mb-1 tracking-tight ${plan.popular ? "text-white" : "text-slate-900 dark:text-white"
                }`}
            >
              {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-6 h-16 flex items-end">
              {plan.price !== null ? (
                <div className={`flex items-baseline gap-1.5 ${plan.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  <span className="text-3xl font-black tracking-tighter">
                    {typeof plan.price === 'number'
                      ? `Rp ${plan.price.toLocaleString('id-ID')}`
                      : `Rp ${plan.price}`
                    }
                  </span>
                  <span className={`text-sm font-bold uppercase tracking-widest ${plan.popular ? "text-slate-500" : "text-slate-400 dark:text-slate-500"}`}>
                    / {plan.interval}
                  </span>
                </div>
              ) : (
                <div className={`text-3xl font-black ${plan.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  Custom
                </div>
              )}
            </div>

            {/* Description */}
            <p
              className={`text-sm mb-10 leading-relaxed font-medium min-h-[60px] ${plan.popular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
                }`}
            >
              {plan.description}
            </p>

            {/* CTA Button */}
            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 text-center active:scale-[0.95] ${plan.popular
                ? "bg-white text-[#0B1120] shadow-lg hover:scale-[1.02]"
                : "bg-[#0B1120] dark:bg-blue-600 text-white shadow-md hover:bg-blue-700"
                } ${plan.buttonStyle === 'contact' ? '!bg-orange-500 !text-white' : ''
                }`}
            >
              {plan.buttonText}
            </button>

            {/* Separator */}
            <div className={`h-[1px] w-full my-8 ${plan.popular ? "bg-slate-800" : "bg-slate-100 dark:bg-slate-800"}`} />

            {/* Features */}
            <div className="flex-1">
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${plan.popular ? "text-slate-500" : "text-slate-400"
                }`}>
                Included Features
              </p>
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4 text-sm">
                    <div className={`mt-0.5 rounded-full p-1 flex-shrink-0 ${plan.popular ? "bg-white/10 text-blue-400" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className={`font-semibold transition-colors ${plan.popular ? "text-slate-300" : "text-slate-600 dark:text-slate-400"
                      }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Read all details */}
            <div className={`mt-10 text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-2 self-start transition-all ${plan.popular
              ? "text-blue-400 group-hover:text-white"
              : "text-blue-600 dark:text-blue-400 group-hover:gap-3"
              }`}>
              Read all details
              <span className="text-lg leading-none">→</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );

  if (mode === "inline") {
    return Content;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-[84rem] max-h-[95vh] overflow-y-auto transform transition-all duration-300 scrollbar-hide ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {Content}
      </div>
    </div>
  );
}

// Export legacy name for backward compatibility if needed, though verify usage
export { ChoosePlan as ChoosePlanModal };
