"use client";

import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useGetWords from "@/features/words/api/use-get-words";
import TestForm from "./test-form";
import useGetTest from "../api/use-get-test";
import useEditTest from "../api/use-edit-test";
import useOpenTest from "../hooks/use-open-test";
import useDeleteTest from "../api/use-delete-test";
import useConfirm from "@/hooks/use-confirm";

const formSchema = z.object({
  title: z
    .string({ required_error: "テスト名を入力してください..." })
    .trim()
    .min(1, { message: "テスト名を入力してください..." }),
  ids: z.string().array(),
});

type FromValues = z.input<typeof formSchema>;

const EditTestSheet = () => {
  const [ConfimDaialog, confirm] = useConfirm(
    "本当に削除しますか?",
    "この操作は取り消せません",
  );

  const { id, isOpen, onClose } = useOpenTest();

  const testQuery = useGetTest(id);
  const test = testQuery.data;

  const wordsQuery = useGetWords();
  const words = wordsQuery.data;

  const { mutate: editTest, isPending } = useEditTest(id);
  const { mutate: deleteTest, isPending: isDeletePending } = useDeleteTest(id);

  const handleSubmit = (values: FromValues) => {
    editTest(values, { onSuccess: onClose });
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteTest(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <>
      <ConfimDaialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>テスト編集</SheetTitle>
            <SheetDescription>
              テスト名と単語を選択してください
            </SheetDescription>
          </SheetHeader>
          <TestForm
            id={id}
            onSubmit={handleSubmit}
            words={words ?? []}
            disabled={isPending || isDeletePending}
            defaultValues={{ ...test!, ids: [] }}
            onDelete={handleDelete}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTestSheet;
