"use client";

import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import useGetWords from "@/features/words/api/use-get-words";
import WordItem from "@/features/words/components/word-item";
import { Loader2 } from "lucide-react";

const WordsPage = () => {
  const wordsQuery = useGetWords();
  const data = wordsQuery.data;

  if (wordsQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ul className="space-y-2">
        {data?.map((word) => (
          <li key={word.id} className="space-y-2">
            <Link href={`/words/${word.word}`}>
              <WordItem data={word} />
            </Link>
            <Separator />
          </li>
        ))}
        <p className="first:block hidden">まだ単語は登録されていません...</p>
      </ul>
    </div>
  );
};

export default WordsPage;
