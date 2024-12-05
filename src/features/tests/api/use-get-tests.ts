import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

const useGetTests = () => {
  const query = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await client.api.tests.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetTests;
