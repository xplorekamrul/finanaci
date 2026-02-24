import SidebarFrameClient from "@/components/layout/SidebarFrameClient";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

async function AuthCheck() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  return isAuthenticated;
}

export default async function SidebarFrame({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SidebarFrameClient isAuthenticated={false}>{children}</SidebarFrameClient>}>
      <SidebarFrameAsync>{children}</SidebarFrameAsync>
    </Suspense>
  );
}

async function SidebarFrameAsync({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await AuthCheck();
  return <SidebarFrameClient isAuthenticated={isAuthenticated}>{children}</SidebarFrameClient>;
}
