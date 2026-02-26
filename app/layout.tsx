import SidebarFrame from "@/components/layout/SidebarFrame";
import AppProviders from "@/components/providers/AppProviders";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Financi" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-screen bg-light dark:bg-background text-foreground">
        <AppProviders>
          <SidebarFrame>
            {children}
          </SidebarFrame>
        </AppProviders>
      </body>
    </html>
  );
}
