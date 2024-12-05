import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { Hono } from "hono";

import { authMiddleware } from "@/lib/auth-middleware";
import { tests, words, wordsToTests } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/", authMiddleware, async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!session.user?.id) {
      return c.json({ error: "User not found" }, 404);
    }

    const data = await db
      .select({
        id: tests.id,
        title: tests.title,
      })
      .from(tests)
      .where(eq(tests.userId, session.user.id));

    return c.json({ data });
  })
  .get(
    "/:id",
    authMiddleware,
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const session = c.get("session");
      const { id } = c.req.valid("param");

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!id) {
        return c.json({ error: "Missing id" }, 404);
      }

      const query = db
        .select()
        .from(wordsToTests)
        .innerJoin(words, eq(words.id, wordsToTests.wordId));

      const data =
        id !== "all"
          ? await query.where(eq(wordsToTests.testId, id))
          : await query;

      return c.json({ data });
    },
  );

export default app;
