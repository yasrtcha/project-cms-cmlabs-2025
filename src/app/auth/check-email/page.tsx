// check-email/page.tsx
"use client";

import { Suspense } from "react";
import CheckEmailPageContent from "./CheckEmailPageContent";

export const dynamic = "force-dynamic";

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      <CheckEmailPageContent />
    </Suspense>
  );
}
