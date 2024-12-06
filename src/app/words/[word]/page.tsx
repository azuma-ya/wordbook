"use client";

import { useParams } from "next/navigation";

import Markdown from "@/components/markdown/markdown";
import useGetWord from "@/features/words/api/use-get-word";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { LinkIcon, Loader2 } from "lucide-react";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import useCreateWord from "@/features/words/api/use-create-word";

const WordIdPage = () => {
  const { word } = useParams<{ word: string }>();
  const { mutate: createWord, isPending } = useCreateWord();
  const wordQuery = useGetWord(decodeURI(word));
  const data = wordQuery.data;

  const handleCreate = () => createWord({ word });

  if (wordQuery.isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full justify-center items-center">
        <Container maxWidth="sm" className="px-0 space-y-4">
          <h2 className="font-bold text-4xl">{decodeURI(word)}</h2>
          <p>はまだ単語張に追加されていません。</p>
          <Button
            onClick={handleCreate}
            disabled={isPending}
            className="ms-auto flex flex-1"
          >
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            作成
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">{data?.word}</h2>
        {data?.synonyms && (
          <ScrollArea>
            <ul className="flex gap-2 items-center pb-2">
              <LinkIcon className="block size-4" />
              {data.synonyms.map((synonym) => (
                <li key={synonym} className="shrink-0">
                  <Link href={`/words/${synonym}`}>
                    <Badge variant="secondary">{synonym}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
        <Markdown text={data?.explanation} />
      </div>
    </div>
  );
};

export default WordIdPage;
