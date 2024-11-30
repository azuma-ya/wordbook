"use client";

import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Search } from "lucide-react";

import Container from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import useCreateWord from "@/features/words/api/use-create-word";

const WordNewPage = () => {
  const router = useRouter();
  const session = useSession();

  const { mutate: createWord, isPending } = useCreateWord();

  const handleSubmit = (formData: FormData) => {
    const word = formData.get("word") as string;
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
      <Container maxWidth="sm" className="">
        <form
          action={handleSubmit}
          className="m-0 rounded-md border border-input p-0 text-sm shadow-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-input pb-2"
        >
          <Input
            className="focus-within:ring-0 border-none shadow-none"
            placeholder="word..."
            iconProps={{ behavior: "prepend" }}
            icon={Search}
            name="word"
            disabled={isPending}
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
      </Container>
    </div>
  );
};

export default WordNewPage;
