ALTER TABLE "words_to_tests" DROP CONSTRAINT "words_to_tests_word_id_test_id_pk";--> statement-breakpoint
ALTER TABLE "words_to_tests" ALTER COLUMN "test_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "words_to_tests" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_title_unique" UNIQUE("title");