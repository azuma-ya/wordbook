import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

import { toast } from "@/hooks/use-toast";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.words.$post>;
type RequestType = InferRequestType<typeof client.api.words.$post>["json"];

const useCreateWord = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json: RequestType) => {
      const response = await client.api.words.$post({ json });
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      queryClient.invalidateQueries({ queryKey: ["word"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        description: "英単語の作成に失敗しました",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export default useCreateWord;
