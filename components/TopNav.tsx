"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function TopNav({
  email = "",
  roles = [],
}: {
  email?: string;
  roles?: string[];
}) {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const roleLabel = roles.includes("ADMIN")
    ? "Administrator"
    : roles.includes("REVENUE_MANAGER")
      ? "Revenue Manager"
      : "No role assigned";

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className="h-16 border-b bg-white sticky top-0 z-10 w-full flex items-center justify-between px-8"
      style={{ borderColor: "#E5E5E5" }}
    >
      <div className="hidden md:block">
        <p
          className="text-sm font-medium tracking-wide italic"
          style={{ color: "#8B9E23" }}
        >
          Analyze Better. Decide Smarter. Operate Greener.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p
              className="text-xs font-semibold leading-none"
              style={{ color: "#333" }}
            >
              {email || "Signed in"}
            </p>
            <p
              className="text-[10px] mt-1 uppercase tracking-wider"
              style={{ color: "#999" }}
            >
              {roleLabel}
            </p>
          </div>
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center border"
            style={{ backgroundColor: "#f0f5e6", borderColor: "#8B9E23" }}
          >
            <User className="w-5 h-5" style={{ color: "#8B9E23" }} />
          </div>
          <button
            onClick={signOut}
            disabled={signingOut}
            title="Sign out"
            className="p-2 rounded-full transition-colors hover:bg-gray-100 disabled:opacity-50"
            style={{ color: "#999" }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
