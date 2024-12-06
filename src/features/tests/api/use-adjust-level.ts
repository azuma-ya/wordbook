import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferResponseType } from "hono";

import { toast } from "@/hooks/use-toast";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.tests)[":id"]["adjust-level"]["$post"]
>;
type RequestType = {
  adjustment: number;
  id?: string;
};

const useAdjustLevel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (req: RequestType) => {
      const response = await client.api.tests[":id"]["adjust-level"].$post({
        param: { id: req.id },
        json: { adjustment: req.adjustment },
      });
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["level"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        description: "点数の更新に失敗しました",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export default useAdjustLevel;
