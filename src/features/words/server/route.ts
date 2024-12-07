import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { Hono } from "hono";

import { authMiddleware } from "@/lib/auth-middleware";
import openai from "@/lib/openai";
import { insertWordSchema, words, wordsToTests } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/", authMiddleware, async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.select().from(words);

    return c.json({ data });
  })
  .get(
    "/:target",
    authMiddleware,
    zValidator("param", z.object({ target: z.string().optional() })),
    zValidator("query", z.object({ type: z.enum(["id", "word"]) })),
    async (c) => {
      const session = c.get("session");
      const { target } = c.req.valid("param");
      const { type } = c.req.valid("query");

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (!target) {
        return c.json({ error: "Missing target" }, 404);
      }

      const [data] = await db
        .select()
        .from(words)
        .where(eq(type === "id" ? words.id : words.word, target));

      return c.json({ data });
    },
  )
  .post(
    "/",
    authMiddleware,
    zValidator("json", insertWordSchema.pick({ word: true })),
    async (c) => {
      const session = c.get("session");
      const { word } = c.req.valid("json");

      const [existingWord] = await db
        .select()
        .from(words)
        .where(eq(words.word, word));

      if (existingWord) {
        return c.json({ data: existingWord });
      }

      const schema = z.object({
        synonyms: z.string().array(),
        explanation: z.string(),
        meaning: z.string(),
      });

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06", // gpt-4o-mini, gpt-4o-2024-08-06以降のモデルに対応
        messages: [
          {
            role: "system",
            content:
              "このGPTは、英単語の意味や使い方を包括的に説明するためのガイドとして機能します。ユーザーが英単語入力すると、その意味、品詞、類義語、類義語ごとの違い、および5つの例文とその日本語訳を提供します。いくつかの類似語を提供します。類似語の例文では、それぞれの英単語を同じ文脈で使用し、比較できるようにします。類似語は3つ以上出力します。回答は教育的で明確かつ簡潔でありながら、親しみやすいトーンを保ち、学習が楽しくなるようにします。'日本語'で英単語の詳細を説明し、ユーザーが単語の意味だけでなく、類義語間の微妙な違いも理解し、語彙力や実際の使用スキルを向上させることを目指します。トーンはプロフェッショナルながらもフレンドリーで、学習を魅力的で分かりやすいものにします。日本語で説明します。",
          },
          {
            role: "system",
            content:
              "explanationにMarkdownで出力し、見やすく分かりやすいものにします",
          },
          {
            role: "system",
            content: "meaningには単純に意味を並べるだけでよいです。",
          },
          {
            role: "user",
            content: `サンプル：### 意味
"Submit" は動詞で、「提出する」「差し出す」「服従する」といった意味を持ちます。この単語は、通常、書類や提案などを正式に提出する場合や、自分の意見や考えを主張する場面で使われます。また、命令や規則に従うといった意味も含まれています。

### 例文と日本語訳
1. **She decided to submit her application before the deadline.**
   - 彼女は締め切り前に申請書を提出することに決めた。

### 類義語とその違い
- **Present**: "Present" は何かを公開したり、公式に誰かに見せたりする意味を持ちますが、「submit」に比べてフォーマルなニュアンスは弱く、表面的な行動を指します。

### 類義語の例文
- **Present**: She *presented* her findings at the conference.
  - 彼女は会議で彼女の調査結果を発表した。

これらの違いを理解することで、適切な状況で正確な単語を選択できます。`,
          },
          { role: "user", content: word },
        ],
        response_format: zodResponseFormat(schema, "response"),
      });

      const response = completion.choices[0].message.parsed;

      if (!response) {
        return c.json({ error: "Server internal error" }, 500);
      }

      const data = await db.transaction(async (tx) => {
        const [data] = await tx
          .insert(words)
          .values({ ...response, word, userId: session.user?.id! })
          .returning();

        await tx.insert(wordsToTests).values({
          wordId: data.id,
        });
      });

      return c.json({ data });
    },
  );

export const wordCustomApi = new Hono().get(
  "/words:search",
  authMiddleware,
  async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: "/api/words:search" });
  },
);

export default app;
