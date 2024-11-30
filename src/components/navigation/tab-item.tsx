import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface Props {
  href: string;
  value: string;
  isActive?: boolean;
  children: ReactNode;
}

const TabItem = ({ href, children }: Props) => {
  return (
    <Button size="sm" variant="ghost" asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default TabItem;
