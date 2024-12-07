import { toast } from "@/hooks/use-toast";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.tests)[":id"]["$delete"]
>;

const useDeleteTest = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.tests[":id"].$delete({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({ description: "テストを削除しました" });
      queryClient.invalidateQueries({ queryKey: ["test", { id }] });
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        description: "テストの削除に失敗しました",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export default useDeleteTest;
