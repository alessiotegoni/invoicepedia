import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {}

export default function Container({ children, className, ...props }: Props) {
  return (
    <div {...props} className={cn("max-w-5xl mx-auto px-5 h-full", className)}>
      {children}
    </div>
  );
}
