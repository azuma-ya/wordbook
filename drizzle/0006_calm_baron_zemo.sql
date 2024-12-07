ALTER TABLE "tests" DROP CONSTRAINT "tests_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "words" DROP CONSTRAINT "words_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "words_to_tests" DROP CONSTRAINT "words_to_tests_test_id_tests_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tests" ADD CONSTRAINT "tests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "words" ADD CONSTRAINT "words_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "words_to_tests" ADD CONSTRAINT "words_to_tests_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
