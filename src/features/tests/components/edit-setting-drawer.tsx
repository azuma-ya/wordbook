"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
} from "@/components/ui/drawer";
import useEditSetting from "../hooks/use-edit-setting";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useGetLevelCounts from "../api/use-get-level-counts";
import Chart from "./chart";

const formSchema = z.object({
  sleep: z.coerce
    .number()
    .min(0, { message: "0秒以上にしてください" })
    .optional(),
  limit: z.coerce
    .number()
    .min(3, { message: "3秒以上にしてください" })
    .optional(),
});

type FromValues = z.input<typeof formSchema>;

const EditSettingDrawer = () => {
  const router = useRouter();
  const { id, isOpen, onClose } = useEditSetting();

  const levelCountsQuery = useGetLevelCounts(id);
  const levelCounts = levelCountsQuery.data;

  const form = useForm<FromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { sleep: 5, limit: 30 },
  });

  const handleSubmit = (values: FromValues) => {
    onClose();
    router.push(`/tests/${id}?sleep=${values.sleep}&limit=${values.limit}`);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>テスト設定</DrawerTitle>
          <DrawerDescription>時間を変更できます</DrawerDescription>
        </DrawerHeader>
        <Chart data={levelCounts ?? []} />
        <DrawerFooter>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-12"
            >
              <div className="space-y-4">
                <FormField
                  name="sleep"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>次に進むまでの時間</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="sleep..."
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="ml-10" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="limit"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>制限時間</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="limit..."
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="ml-10" />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full">始める</Button>
            </form>
          </Form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditSettingDrawer;
