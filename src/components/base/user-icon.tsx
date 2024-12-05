import { DEFAULT_ICON } from "@/constants/user";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserIcon = async ({ className }: { className?: string }) => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={session.user?.image || DEFAULT_ICON} alt="UserIcon" />
      <AvatarFallback />
    </Avatar>
  );
};

export default UserIcon;
