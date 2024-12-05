import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <div className={cn("relative aspect-[16/9] h-6", className)}>
      <Image fill src="/logo.svg" alt="Logo" className="object-cover" />
    </div>
  );
};

export default Logo;
