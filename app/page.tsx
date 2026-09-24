"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";

export default function RootPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="animate-pulse text-[var(--color-muted)]">Loading...</div>
    </div>
  );
}
