"use client";
import type React from "react"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { DashboardHeader } from "@/components/DashboardHeader"
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  const { isLoading, token } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    router.push('/login');
  }

  return (
    <DashboardSidebar>
      <div className="flex min-h-screen flex-col w-full">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </DashboardSidebar>
  )
}
