"use client";

import Link from "next/link";

import { useAuth } from "@/contexts/AuthProvider";

export function AuthNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Link
      href="/my#account"
      className="btn-secondary hidden text-sm sm:inline-flex"
      data-testid="auth-nav"
    >
      {user ? "계정" : "로그인"}
    </Link>
  );
}
