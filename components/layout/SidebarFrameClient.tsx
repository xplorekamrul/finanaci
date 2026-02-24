"use client";

import BottomNavbar from "@/components/layout/BottomNavbar";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarFrameClientProps {
   children: React.ReactNode;
   isAuthenticated: boolean;
}

export default function SidebarFrameClient({ children, isAuthenticated }: SidebarFrameClientProps) {
   const [collapsed, setCollapsed] = useState(false);
   const pathname = usePathname();

   // Hide sidebar and bottom nav on these routes or if not authenticated
   const hideSidebarRoutes = ["/login", "/register", "/unauthorized", "/forgot"];
   const shouldHideSidebar = !isAuthenticated || hideSidebarRoutes.some(route => pathname.startsWith(route));

   useEffect(() => {
      const saved = localStorage.getItem("_sidebar_collapsed");
      if (saved != null) setCollapsed(saved === "1");
   }, []);

   const sidebarWidth = collapsed ? "4rem" : "15rem";

   // If sidebar should be hidden, just render children without layout
   if (shouldHideSidebar) {
      return <>{children}</>;
   }

   return (
      <>
         {/* Desktop Layout */}
         <div
            className="hidden md:grid gap-[5px] motion-safe:transition-[grid-template-columns] motion-safe:duration-300 motion-safe:ease-in-out"
            style={
               {
                  gridTemplateColumns: "auto 1fr",
                  height: "100dvh",
               } as React.CSSProperties
            }
         >
            <div
               className="motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-in-out"
               style={{ width: sidebarWidth, willChange: "width" }}
            >
               <Sidebar collapsed={collapsed} onToggle={setCollapsed} />
            </div>

            <main
               className="min-w-0 overflow-auto"
               style={{ scrollbarGutter: "stable" } as React.CSSProperties}
            >
               {children}
            </main>
         </div>

         {/* Mobile Layout */}
         <div className="md:hidden flex flex-col h-dvh">
            <main
               className="min-w-0 overflow-auto flex-1 pb-16"
               style={{ scrollbarGutter: "stable" } as React.CSSProperties}
            >
               {children}
            </main>
            <BottomNavbar />
         </div>
      </>
   );
}
