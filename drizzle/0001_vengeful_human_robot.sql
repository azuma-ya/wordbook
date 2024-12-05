ALTER TABLE "tests" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tests" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "words_to_tests" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "words_to_tests" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;