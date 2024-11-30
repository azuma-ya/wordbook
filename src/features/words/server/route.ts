import { insertWordSchema } from "@/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import openai from "@/lib/openai";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  .get("/", authMiddleware, async (c) => {
    const session = c.get("session");

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: "hello world" });
  })
  .post(
    "/",
    authMiddleware,
    zValidator("json", insertWordSchema.pick({ word: true })),
    async (c) => {
      const { word } = c.req.valid("json");

      // JSONスキーマ
      const schema = {
        type: "object",
        properties: {
          word: {
            type: "string",
          },
          meaning: {
            type: "string",
          },
          partOfSpeech: {
            type: "string",
          },
          synonsyms: {
            type: "array",
            items: {
              type: "object",
              properties: {
                word: {
                  type: "string",
                },
                meaning: {
                  type: "string",
                },
                examples: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      sentence: {
                        type: "string",
                      },
                      translation: {
                        type: "string",
                      },
                    },
                    required: ["sentence", "translation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["word", "meaning", "examples"],
              additionalProperties: false,
            },
          },
          examples: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sentence: {
                  type: "string",
                },
                translation: {
                  type: "string",
                },
              },
              required: ["sentence", "translation"],
              additionalProperties: false,
            },
          },
          learningPoints: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "word",
          "meaning",
          "partOfSpeech",
          "synonsyms",
          "examples",
          "learningPoints",
        ],
        additionalProperties: false,
      };

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06", // gpt-4o-mini, gpt-4o-2024-08-06以降のモデルに対応
        messages: [
          {
            role: "assistant",
            content:
              "このGPTは、英単語の意味や使い方を包括的に説明するためのガイドとして機能します。ユーザーが英単語を入力すると、その意味、品詞、類義語、類義語ごとの違い（必要に応じて例や説明付き：日本語で）、および5つの例文とその日本語訳を提供します。回答は教育的で明確かつ簡潔でありながら、親しみやすいトーンを保ち、学習が楽しくなるようにします。日本語で英単語の詳細を説明し、ユーザーが単語の意味だけでなく、類義語間の微妙な違いも理解し、語彙力や実際の使用スキルを向上させることを目指します。トーンはプロフェッショナルながらもフレンドリーで、学習を魅力的で分かりやすいものにします。",
          },
          { role: "user", content: word },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "response",
            strict: true,
            schema,
          },
        },
      });

      const response = completion.choices[0].message.parsed as any;

      console.dir(response, { depth: null });

      return c.json({ data: response });
    }
  );

export default app;
