"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAdjustLevel from "@/features/tests/api/use-adjust-level";
import useGetLevelCounts from "@/features/tests/api/use-get-level-counts";
import useGetTest from "@/features/tests/api/use-get-test";
import Chart from "@/features/tests/components/chart";
import WordItem from "@/features/words/components/word-item";
import useProgressTimer from "@/hooks/use-progress-timer";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const TestIdPage = () => {
  const searchParams = useSearchParams();
  const sleep = Number.parseInt(searchParams.get("sleep") ?? "5");
  const limit = Number.parseInt(searchParams.get("limit") ?? "30");
  const { testId } = useParams<{ testId: string }>();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isShowAnswer, setIsAnswer] = useState(false);
  const [isPending, startTransition] = useTransition();

  const testQuery = useGetTest(testId);
  const test = testQuery.data;

  const levelCountsQuery = useGetLevelCounts(testId);
  const levelCounts = levelCountsQuery.data;

  const { mutate: adjustLevelMutation } = useAdjustLevel();

  const [Timer, _, pause, reset] = useProgressTimer(limit, () => {
    handleEnableAnswer();
  });

  const handleEnableAnswer = () => {
    pause();
    setIsAnswer(true);
  };

  const handleNext = () => {
    isShowAnswer ? faild() : success();
  };

  const success = () => {
    pause();
    adjustLevelMutation({ adjustment: 1, id: wordTest?.id });
    startTransition(async () => {
      setIsAnswer(true);
      await new Promise((resolve) => setTimeout(resolve, sleep * 1000));
      reset();
      setIsAnswer(false);
      nextWord();
    });
  };

  const faild = () => {
    reset();
    adjustLevelMutation({ adjustment: -1, id: wordTest?.id });
    setIsAnswer(false);
    nextWord();
  };

  const nextWord = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const word = test?.[activeIndex]?.words;
  const wordTest = test?.[activeIndex]?.words_to_tests;

  // Result page
  if (!word) {
    return (
      <div className="h-full space-y-4">
        <Chart data={levelCounts ?? []} />
        <ul className="space-y-2">
          {test?.map((item) => (
            <li key={item.words.id} className="space-y-2">
              <Link href={`/words/${item.words.word}`}>
                <WordItem data={item.words} />
              </Link>
              <Separator />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col py-8">
      <Timer />
      <div className="flex-1 flex-col gap-4 flex items-center justify-center">
        <h2 className="">{word?.word}</h2>
        {isShowAnswer && <p>{word?.meaning}</p>}
      </div>
      <div className="flex justify-between gap-4 px-24">
        <Button
          onClick={handleEnableAnswer}
          disabled={isShowAnswer}
          variant="outline"
          className="basis-1/2"
        >
          忘れた
        </Button>
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="basis-1/2 shrink-0"
        >
          {isShowAnswer ? "次へ" : "覚えてる"}
        </Button>
      </div>
    </div>
  );
};

export default TestIdPage;
