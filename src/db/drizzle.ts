import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pool = postgres(process.env.DATABASE_URL as string, { max: 1 });

export const db = drizzle(pool);
