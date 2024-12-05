import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

const useGetTest = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["test"],
    queryFn: async () => {
      const response = await client.api.tests[":id"].$get({ param: { id } });
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetTest;
