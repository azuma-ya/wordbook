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
import useGetLevelCounts from "../api/use-get-level-counts";
import Chart from "./chart";
import useGetTest from "../api/use-get-test";

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

  const testQuery = useGetTest(id);
  const test = testQuery.data;

  const levelCountsQuery = useGetLevelCounts(id);
  const levelCounts = levelCountsQuery.data;

  const form = useForm<FromValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { sleep: 2, limit: 10 },
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
        <Chart data={levelCounts ?? []} title={test?.title} />
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
                        <div className="flex gap-4 items-center justify-center">
                          <input {...field} className="hidden" />
                          <Button
                            type="button"
                            onClick={() =>
                              field.onChange(Math.max(field.value! - 1, 0))
                            }
                          >
                            -1
                          </Button>
                          <Button disabled variant="outline">
                            {field.value}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => field.onChange(field.value! + 1)}
                          >
                            +1
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
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
                        <div className="flex gap-4 items-center justify-center">
                          <input {...field} className="hidden" />
                          <Button
                            type="button"
                            onClick={() =>
                              field.onChange(Math.max(field.value! - 1, 0))
                            }
                          >
                            -1
                          </Button>
                          <Button disabled variant="outline">
                            {field.value}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => field.onChange(field.value! + 1)}
                          >
                            +1
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
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
