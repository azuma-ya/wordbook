import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

const useGetQuestions = (testId?: string) => {
  const query = useQuery({
    enabled: !!testId,
    queryKey: ["test"],
    queryFn: async () => {
      const response = await client.api.tests[":id"].questions.$get({
        param: { id: testId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetQuestions;
