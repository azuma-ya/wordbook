import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useCallback } from "react";

const useProgressTimer = (
  time: number,
  callback?: () => void,
): [() => JSX.Element, () => void, () => void, () => void] => {
  const [timeLeft, setTimeLeft] = useState(time);
  const [isRunning, setIsRunning] = useState(true);
  const fps = 50;

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    console.log("click");
  }, []);

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(time);
    setIsRunning(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1 / fps);
      }, 1000 / fps);
    } else {
      pauseTimer();
      callback?.();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, pauseTimer, callback]);

  const ProgresTimer = () => <Progress value={(timeLeft * 100) / time} />;

  return [ProgresTimer, resumeTimer, pauseTimer, resetTimer];
};

export default useProgressTimer;
