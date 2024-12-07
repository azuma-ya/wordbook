"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useNewTest from "../hooks/use-new-test";
import useCreateTest from "../api/use-create-test";
import {} from "@/components/ui/form";
import useGetWords from "@/features/words/api/use-get-words";
import TestForm from "./test-form";

const formSchema = z.object({
  title: z
    .string({ required_error: "テスト名を入力してください..." })
    .trim()
    .min(1, { message: "テスト名を入力してください..." }),
  ids: z.string().array(),
});

type FromValues = z.input<typeof formSchema>;

const NewTestSheet = () => {
  const { isOpen, onClose } = useNewTest();

  const wordsQuery = useGetWords();
  const words = wordsQuery.data;

  const { mutate: createTest, isPending } = useCreateTest();

  const handleSubmit = (values: FromValues) => {
    createTest(values, { onSuccess: onClose });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>テスト作成</SheetTitle>
          <SheetDescription>テスト名と単語を選択してください</SheetDescription>
        </SheetHeader>
        <TestForm
          onSubmit={handleSubmit}
          words={words ?? []}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewTestSheet;
