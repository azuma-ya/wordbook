"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAdjustLevel from "@/features/questions/api/use-adjust-level";
import useGetLevelCounts from "@/features/tests/api/use-get-level-counts";
import useGetQuestions from "@/features/tests/api/use-get-questions";
import Chart from "@/features/tests/components/chart";
import WordItem from "@/features/words/components/word-item";
import useProgressTimer from "@/hooks/use-progress-timer";
import { label } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const TestIdPage = () => {
  const searchParams = useSearchParams();
  const sleep = Number.parseInt(searchParams.get("sleep") ?? "2");
  const limit = Number.parseInt(searchParams.get("limit") ?? "10");
  const { testId } = useParams<{ testId: string }>();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isShowAnswer, setIsAnswer] = useState(false);
  const [isPending, startTransition] = useTransition();

  const questionsQuery = useGetQuestions(testId);
  const questions = questionsQuery.data;

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

  const word = questions?.[activeIndex]?.words;
  const wordTest = questions?.[activeIndex]?.words_to_tests;

  if (questionsQuery.isLoading || !questions) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Result page
  if (!word) {
    return (
      <div className="h-full space-y-4">
        <Chart data={levelCounts ?? []} />
        <ul className="space-y-2">
          {questions?.map((item) => (
            <li key={item.words.id} className="space-y-2">
              <div className="flex gap-2 items-center">
                <div className="basis-1/4">
                  <Badge variant="secondary" className="h-6">
                    {label(item.words_to_tests.level)}
                  </Badge>
                </div>
                <WordItem data={item.words} />
              </div>
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
