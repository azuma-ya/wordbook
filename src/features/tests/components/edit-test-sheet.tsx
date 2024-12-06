"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useCreateTest from "../api/use-create-test";
import useGetWords from "@/features/words/api/use-get-words";
import useEditTest from "../hooks/use-edit-test";
import TestForm from "./test-form";
import useGetTest from "../api/use-get-test";

const formSchema = z.object({
  title: z
    .string({ required_error: "テスト名を入力してください..." })
    .trim()
    .min(1, { message: "テスト名を入力してください..." }),
});

type FromValues = z.input<typeof formSchema>;

const EditTestSheet = () => {
  const { id, isOpen, onClose } = useEditTest();

  const testQuery = useGetTest(id);
  const test = testQuery.data;

  const wordsQuery = useGetWords();
  const words = wordsQuery.data;

  const { mutate: createTest, isPending } = useCreateTest();

  const handleSubmit = (values: FromValues) => {
    createTest(
      { ...values, ids: [] },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>テスト編集</SheetTitle>
          <SheetDescription>テスト名と単語を選択してください</SheetDescription>
        </SheetHeader>
        <TestForm
          id={id}
          onSubmit={handleSubmit}
          words={words ?? []}
          disabled={isPending}
          defaultValues={test}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditTestSheet;
