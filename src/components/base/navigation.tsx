import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import UserButton from "./user-button";

const Navigation = async () => {
  const session = await auth();

  return (
    <nav className="flex items-center gap-x-3">
      {session ? (
        <UserButton />
      ) : (
        <Button asChild size="sm">
          <Link href="/sign-in">ログイン</Link>
        </Button>
      )}
    </nav>
  );
};

export default Navigation;
