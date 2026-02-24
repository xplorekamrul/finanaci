"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import {
  Banknote,
  LayoutDashboard,
  Settings,
  Share2,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: TrendingUp },
  { label: "Categories", href: "/categories", icon: Tag },
  { label: "Savings", href: "/savings", icon: Banknote },
  { label: "Borrowed", href: "/borrowed", icon: Share2 },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex md:hidden z-40 overflow-x-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="flex-1 min-w-max md:flex-none">
            <Button
              variant="ghost"
              className={clsx(
                "w-full h-16 rounded-none flex flex-col items-center justify-center gap-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
