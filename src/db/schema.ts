import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const words = pgTable("words", {
  word: text("word").notNull().primaryKey(),
  meaning: text("meaning").notNull(),
  partOfSpeech: text("part_of_speech"),
});

export const wordsRelations = relations(words, ({ many }) => ({
  examples: many(examples),
  learningPoints: many(learningPoints),
  synonyms: many(synonyms),
}));

export const insertWordSchema = createInsertSchema(words);

export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  word: text("word_id").references(() => words.word, { onDelete: "cascade" }),
  sentence: text("sentence"),
  translation: text("translation"),
});

export const insertExampleSchema = createInsertSchema(examples);

export const learningPoints = pgTable("learning_points", {
  id: serial("id").primaryKey(),
  word: text("word").references(() => words.word, { onDelete: "cascade" }),
  point: text("point").notNull(),
});

export const insertLearningPointsSchema = createInsertSchema(learningPoints);

export const synonyms = pgTable("synonyms", {
  id: serial("id").primaryKey(),
  word: text("word").references(() => words.word, { onDelete: "cascade" }),
  difference: text("difference"),
});

export const synoymsRelations = relations(synonyms, ({ many }) => ({
  examples: many(examples),
}));

export const insertSynonymsSchema = createInsertSchema(synonyms);
