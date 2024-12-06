"use client";

import { DEFAULT_ICON } from "@/constants/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";

const UserIcon = ({ className }: { className?: string }) => {
  const { data: session } = useSession();

  return (
    <Avatar className={className}>
      <AvatarImage src={session?.user?.image || DEFAULT_ICON} alt="UserIcon" />
      <AvatarFallback />
    </Avatar>
  );
};

export default UserIcon;
