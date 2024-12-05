"use client";

import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import useGetWords from "@/features/words/api/use-get-words";
import WordItem from "@/features/words/components/word-item";

const WordsPage = () => {
  const wordsQuery = useGetWords();
  const data = wordsQuery.data;

  return (
    <div className="h-full">
      <ul className="space-y-2">
        <p className="last:block hidden">まだ単語は登録されていません...</p>
        {data?.map((word) => (
          <li key={word.id} className="space-y-2">
            <Link href={`/words/${word.word}`}>
              <WordItem data={word} />
            </Link>
            <Separator />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordsPage;
