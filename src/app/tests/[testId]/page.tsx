"use client";

import { Button } from "@/components/ui/button";
import useGetTest from "@/features/tests/api/use-get-test";
import useProgressTimer from "@/hooks/use-progress-timer";
import { useParams } from "next/navigation";
import { useState } from "react";

const TestIdPage = () => {
  const { testId } = useParams<{ testId: string }>();

  const [testNumber, setTestNumber] = useState(0);
  const [isShowAnswer, setIsAnswer] = useState(false);

  const testQuery = useGetTest(testId);
  const test = testQuery.data;

  const [Timer, pause, reset] = useProgressTimer(30, () => {
    setIsAnswer(true);
  });

  const handleEnableAnswer = () => {
    pause();
    setIsAnswer(true);
  };
  const handleDisableAnswer = () => setIsAnswer(false);

  const handleNext = () => {
    handleDisableAnswer();
    reset();
    test && testNumber < test.length - 1 && setTestNumber((prev) => prev + 1);
  };

  const word = test?.[testNumber].words;

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
        <Button onClick={handleNext} className="basis-1/2 shrink-0">
          {isShowAnswer ? "次へ" : "覚えてる"}
        </Button>
      </div>
    </div>
  );
};

export default TestIdPage;
