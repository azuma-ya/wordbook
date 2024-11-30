CREATE TABLE IF NOT EXISTS "example" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_id" text,
	"sentence" text,
	"translation" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text,
	"point" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "synonyms" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text,
	"difference" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "words" (
	"word" text PRIMARY KEY NOT NULL,
	"meaning" text NOT NULL,
	"part_of_speech" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example" ADD CONSTRAINT "example_word_id_words_word_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("word") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_points" ADD CONSTRAINT "learning_points_word_words_word_fk" FOREIGN KEY ("word") REFERENCES "public"."words"("word") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "synonyms" ADD CONSTRAINT "synonyms_word_words_word_fk" FOREIGN KEY ("word") REFERENCES "public"."words"("word") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
