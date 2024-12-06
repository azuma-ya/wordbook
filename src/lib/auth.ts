import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db } from "@/db/drizzle";
import authConfig from "../../auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "sign-in",
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  ...authConfig,
});
