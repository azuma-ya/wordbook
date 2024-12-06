import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";

import words, { wordCustomApi } from "@/features/words/server/route";
import tests from "@/features/tests/server/route";

export const maxDuration = 59;

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "Internal error" }, 500);
});

const routes = app
  .route("/words", words)
  .route("/tests", tests)
  .route("/", wordCustomApi);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
