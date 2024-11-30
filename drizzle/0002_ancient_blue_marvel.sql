ALTER TABLE "example" RENAME TO "examples";--> statement-breakpoint
ALTER TABLE "examples" DROP CONSTRAINT "example_word_id_words_word_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "examples" ADD CONSTRAINT "examples_word_id_words_word_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("word") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
