import { FcGoogle } from "react-icons/fc";

import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function SingInPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit">
          <FcGoogle className="mr-2 size-5" />
          Googleでログイン
        </Button>
      </form>
    </div>
  );
}
