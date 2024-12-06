import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

import { toast } from "@/hooks/use-toast";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.tests.$post>;
type RequestType = InferRequestType<typeof client.api.tests.$post>["json"];

const useCreateTest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json: RequestType) => {
      const response = await client.api.tests.$post({ json });
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        description: "テストの作成に失敗しました",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export default useCreateTest;
