import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

const useGetWords = () => {
  const query = useQuery({
    queryKey: ["words"],
    queryFn: async () => {
      const response = await client.api.words.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch words");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetWords;
