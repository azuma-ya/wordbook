"use client";

import { useCallback } from "react";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BookCheck, List, Search, Settings } from "lucide-react";
import Link from "next/link";
import Container from "../layout/container";

const routes = [
  { href: "/", label: "調べる", icon: Search },
  { href: "/words", label: "見つける", icon: List },
  { href: "/tests", label: "テスト", icon: BookCheck },
  { href: "/dashboard/setting", label: "設定", icon: Settings },
];

const Footer = () => {
  const pathname = usePathname();

  const isActive = useCallback((href: string) => pathname === href, [pathname]);

  return (
    <footer className="pt-2 pb-6 bg-background">
      <Container className="flex items-center justify-evenly">
        {routes.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="flex flex-col items-center">
              <item.icon
                className={cn(
                  "size-5",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-foreground/30",
                )}
              />
              <p
                className={cn(
                  "text-xs",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-foreground/30",
                )}
              >
                {item.label}
              </p>
            </div>
          </Link>
        ))}
      </Container>
    </footer>
  );
};

export default Footer;
