import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Loading = ({ className }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className={cn("size-4 animate-spin", className)} />
    </div>
  );
};

export default Loading;
