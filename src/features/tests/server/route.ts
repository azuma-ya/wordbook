import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { Hono } from "hono";

import { authMiddleware } from "@/lib/auth-middleware";
import { insertTestSchema, tests, words, wordsToTests } from "@/db/schema";
import { db } from "@/db/drizzle";
import { and, count, eq, sql } from "drizzle-orm";

const app = new Hono()
  .get("/", authMiddleware, async (c) => {
    const session = c.get("session");

    if (!session.user?.id) {
      return c.json({ error: "User not found" }, 404);
    }

    const data = await db
      .select({
        id: tests.id,
        title: tests.title,
        wordCount: sql<number>`COUNT(${wordsToTests.id})`.mapWith(Number),
      })
      .from(tests)
      .leftJoin(wordsToTests, eq(wordsToTests.testId, tests.id))
      .where(eq(tests.userId, session.user.id))
      .groupBy(tests.id, tests.title);

    return c.json({ data });
  })
  .get(
    "/:id",
    authMiddleware,
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const session = c.get("session");
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 404);
      }

      if (id === "all") {
        return c.json({
          data: { id: "all", userId: session.user?.id!, title: "ALL" },
        });
      }

      const [data] = await db.select().from(tests).where(eq(tests.id, id));

      return c.json({ data });
    }
  )
  .get(
    "/:id/questions",
    authMiddleware,
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

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
    }
  )
  .get(
    "/:id/level-counts",
    authMiddleware,
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 404);
      }

      const query = db
        .select({
          level: wordsToTests.level,
          count: count(),
        })
        .from(wordsToTests)
        .groupBy(wordsToTests.level);

      const data =
        id !== "all"
          ? await query.where(eq(wordsToTests.testId, id))
          : await query;

      return c.json({ data });
    }
  )
  .post(
    "/",
    authMiddleware,
    zValidator(
      "json",
      insertTestSchema.pick({ title: true }).merge(
        z.object({
          ids: z.array(z.string()),
        })
      )
    ),
    async (c) => {
      const session = c.get("session");
      const { title, ids } = c.req.valid("json");

      const data = await db.transaction(async (tx) => {
        const [data] = await tx
          .insert(tests)
          .values({ title, userId: session.user!.id! })
          .returning();

        ids.length > 0 &&
          (await tx
            .insert(wordsToTests)
            .values(ids.map((id) => ({ wordId: id, testId: data.id }))));

        return data;
      });

      return c.json({ data });
    }
  )
  .post(
    "/:id",
    authMiddleware,
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      insertTestSchema.pick({ title: true }).merge(
        z.object({
          ids: z.array(z.string()),
        })
      )
    ),
    async (c) => {
      const session = c.get("session");
      const { id } = c.req.valid("param");
      const { title, ids } = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 404);
      }

      const data = await db.transaction(async (tx) => {
        const [data] = await tx
          .update(tests)
          .set({ title })
          .where(and(eq(tests.id, id), eq(tests.userId, session.user?.id!)))
          .returning();

        ids.length > 0 &&
          (await tx
            .insert(wordsToTests)
            .values(ids.map((id) => ({ wordId: id, testId: data.id }))));

        return data;
      });

      return c.json({ data });
    }
  )
  .post(
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
    }
  );

export default app;
