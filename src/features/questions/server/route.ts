import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { authMiddleware } from "@/lib/auth-middleware";
import { wordsToTests } from "@/db/schema";

const app = new Hono().post(
  "/:id/adjust-level",
  authMiddleware,
  zValidator("param", z.object({ id: z.string().optional() })),
  zValidator("json", z.object({ adjustment: z.number() })),
  async (c) => {
    const { adjustment } = c.req.valid("json");
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing id" }, 404);
    }

    const [data] = await db
      .update(wordsToTests)
      .set({ level: sql`GREATEST(${wordsToTests.level} + ${adjustment}, 0)` })
      .where(eq(wordsToTests.id, id))
      .returning();

    return c.json({ data });
  },
);

export default app;
