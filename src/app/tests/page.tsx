"use client";

import { Separator } from "@/components/ui/separator";
import useGetTests from "@/features/tests/api/use-get-tests";
import TestItem from "@/features/tests/components/test-item";
import Link from "next/link";

const TestsPage = () => {
  const testsQuery = useGetTests();
  const tests = testsQuery.data;

  const defautlTest = {
    id: "all",
    title: "All",
  };

  return (
    <div>
      <ul className="space-y-2">
        {[defautlTest, ...(tests ?? [])].map((test) => (
          <li key={test.id} className="space-y-2">
            <Link href={`/tests/${test.id}`}>
              <TestItem data={test} />
            </Link>
            <Separator />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestsPage;
