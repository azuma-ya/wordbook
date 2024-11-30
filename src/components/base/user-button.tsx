import { forwardRef } from "react";

import Link from "next/link";

import UserIcon from "@/components/base/user-icon";
import { auth } from "@/lib/auth";
import { Button, type ButtonProps } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const routes = [
  { href: "/dashboard/history", label: "履歴" },
  { href: "/dashboard/setting", label: "設定" },
];

const UserButton = forwardRef<HTMLButtonElement, ButtonProps>(
  async (props, ref) => {
    const session = await auth();

    if (!session) {
      return null;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full size-8"
            ref={ref}
            {...props}
          >
            <UserIcon className="size-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="mx-2 w-48">
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          {routes.map((route) => (
            <DropdownMenuItem key={route.href} asChild>
              <Link href={route.href}>{route.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
UserButton.displayName = "UserButton";

export default UserButton;
