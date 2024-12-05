import type { client } from "@/lib/hono";
import type { InferResponseType } from "hono/client";

type Props = {
  data: InferResponseType<typeof client.api.words.$get, 200>["data"][0];
};

const WordItem = ({ data }: Props) => {
  return (
    <div>
      <h2 className="font-semibold text-xl">{data.word}</h2>
      <p className="text-xs">{data.meaning}</p>
    </div>
  );
};

export default WordItem;
