import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

const useGetWord = (word?: string) => {
  const query = useQuery({
    enabled: !!word,
    queryKey: ["word", { word }],
    queryFn: async () => {
      const response = await client.api.words[":target"].$get({
        param: { target: word },
        query: { type: "word" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch words");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetWord;
