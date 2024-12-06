"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGetTests from "@/features/tests/api/use-get-tests";
import TestItem from "@/features/tests/components/test-item";
import useEditSetting from "@/features/tests/hooks/use-edit-setting";
import useEditTest from "@/features/tests/hooks/use-edit-test";
import useNewTest from "@/features/tests/hooks/use-new-test";

const TestsPage = () => {
  const newTest = useNewTest();
  const editTest = useEditTest();
  const editSetting = useEditSetting();
  const testsQuery = useGetTests();
  const tests = testsQuery.data;

  const defautlTest = {
    id: "all",
    title: "All",
    wordCount: 1,
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={newTest.onOpen}
        className="flex ms-auto"
      >
        新規
      </Button>
      <ul className="space-y-2">
        {[defautlTest, ...(tests ?? [])].map((test) => (
          <li key={test.id} className="space-y-2">
            <button
              type="button"
              onClick={() =>
                test.wordCount === 0
                  ? editTest.onOpen(test.id)
                  : editSetting.onOpen(test.id)
              }
              className="w-full"
            >
              <TestItem data={test} />
            </button>
            <Separator />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestsPage;
