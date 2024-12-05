"use client";

import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Container from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import useCreateWord from "@/features/words/api/use-create-word";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  word: z
    .string({ required_error: "単語を入力してください..." })
    .trim()
    .min(1, { message: "単語を入力してください..." }),
});

type FromValues = z.input<typeof formSchema>;

const WordNewPage = () => {
  const router = useRouter();
  const session = useSession();
  const form = useForm<FromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { word: "" },
  });

  const { mutate: createWord, isPending } = useCreateWord();

  const handleSubmit = (data: FromValues) => {
    const { word } = data;
    createWord(
      { word },
      {
        onSuccess: () => {
          router.push(`/words/${word}`);
        },
      },
    );
  };

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-full justify-center items-center">
      <Container maxWidth="sm" className="px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="m-0 rounded-md border border-input p-0 text-sm shadow-sm transition-colors focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-input pb-2"
          >
            <FormField
              name="word"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="focus-within:ring-0 border-none shadow-none"
                      placeholder="word..."
                      iconProps={{ behavior: "prepend" }}
                      icon={Search}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-10" />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="size-5 bg-primary rounded-full flex items-center justify-center ml-auto mr-2"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 text-background animate-spin" />
              ) : (
                <ArrowUp className="size-4 text-background" />
              )}
            </button>
          </form>
        </Form>
      </Container>
    </div>
  );
};

export default WordNewPage;
