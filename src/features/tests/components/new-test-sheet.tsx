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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormMessage,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z
    .string({ required_error: "テスト名を入力してください..." })
    .trim()
    .min(1, { message: "テスト名を入力してください..." }),
});

type FromValues = z.input<typeof formSchema>;

const NewTestSheet = () => {
  const { isOpen, onClose } = useNewTest();

  const { mutate: createTest, isPending } = useCreateTest();

  const form = useForm<FromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

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
          <SheetTitle>テスト作成</SheetTitle>
          <SheetDescription>テスト名と単語を選択してください</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Title..."
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-10" />
                </FormItem>
              )}
            />
            <Button className="w-full">作成</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewTestSheet;
