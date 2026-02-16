"use client";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default async function Providers({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
