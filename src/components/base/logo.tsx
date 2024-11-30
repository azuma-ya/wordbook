import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return <p className={cn("text-xl font-semibold", className)}>WordBook</p>;
};

export default Logo;
