"use client";

import { useCallback } from "react";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Search, Settings } from "lucide-react";
import Link from "next/link";
import Container from "../layout/container";
import { Button } from "../ui/button";

const routes = [
  { href: "/", label: "調べる", icon: Search },
  { href: "/dashboard/setting", label: "設定", icon: Settings },
];

const Footer = () => {
  const pathname = usePathname();

  const isActive = useCallback((href: string) => pathname === href, [pathname]);

  return (
    <footer className="pt-2 pb-6 bg-background">
      <Container className="flex items-center justify-evenly">
        {routes.map((item) => (
          <Button key={item.href} variant="ghost" size="icon" asChild>
            <Link href={item.href}>
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
          </Button>
        ))}
      </Container>
    </footer>
  );
};

export default Footer;
