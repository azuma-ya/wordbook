import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-display/data-table";
import { columns } from "./columns";
import type { client } from "@/lib/hono";
import type { InferResponseType } from "hono/client";

const formSchema = z.object({
  title: z
    .string({ required_error: "テスト名を入力してください..." })
    .trim()
    .min(1, { message: "テスト名を入力してください..." }),
});

type FromValues = z.input<typeof formSchema>;

interface Props {
  id?: string;
  defaultValues?: FromValues;
  onSubmit: (values: FromValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  words: InferResponseType<typeof client.api.words.$get, 200>["data"];
}

const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  words,
}: Props) => {
  const form = useForm<FromValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title..." disabled={disabled} {...field} />
              </FormControl>
              <FormMessage className="ml-10" />
            </FormItem>
          )}
        />
        <DataTable columns={columns} data={words} />
        <Button className="w-full">{id ? "更新" : "作成"}</Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            variant="ghost"
            className="w-full"
          >
            <Trash className="size-4 mr-2" />
            削除
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TransactionForm;
