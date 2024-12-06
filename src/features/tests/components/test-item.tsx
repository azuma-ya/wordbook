import type { client } from "@/lib/hono";
import type { InferResponseType } from "hono/client";

type Props = {
  data: InferResponseType<typeof client.api.tests.$get, 200>["data"][0];
};

const TestItem = ({ data }: Props) => {
  return (
    <div>
      <h2 className="font-semibold text-xl text-start">{data.title}</h2>
    </div>
  );
};

export default TestItem;
