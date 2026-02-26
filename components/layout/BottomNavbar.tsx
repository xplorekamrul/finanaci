"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import {
  Banknote,
  Handshake,
  LayoutDashboard,
  Menu,
  Share2,
  Tag,
  TrendingUp,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: TrendingUp },
  { label: "Categories", href: "/categories", icon: Tag },
  { label: "Savings", href: "/savings", icon: Banknote },
  { label: "Borrowed", href: "/borrowed", icon: Share2 },
  { label: "Loans Given", href: "/loans", icon: Handshake },
];

const visibleItems = navItems.slice(0, 3);
const moreItems = navItems.slice(3);

export default function BottomNavbar() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMoreMenu]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex md:hidden z-40">
      {/* Visible Items */}
      <div className="flex flex-1 overflow-x-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex-1 min-w-max">
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

      {/* Hamburger Menu */}
      {moreItems.length > 0 && (
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="h-16 w-16 rounded-none flex flex-col items-center justify-center gap-1"
          >
            {showMoreMenu ? <X size={20} /> : <Menu size={20} />}
          </Button>

          {/* Dropdown Menu */}
          {showMoreMenu && (
            <div className="absolute bottom-16 right-0 bg-card border border-border rounded-lg shadow-lg min-w-48 z-50">
              {moreItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMoreMenu(false)}
                    className="block"
                  >
                    <Button
                      variant="ghost"
                      className={clsx(
                        "w-full justify-start rounded-none px-4 py-2 h-auto",
                        isActive ? "text-primary bg-primary/10" : "text-foreground"
                      )}
                    >
                      <Icon size={18} className="mr-3" />
                      <span className="text-sm">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
