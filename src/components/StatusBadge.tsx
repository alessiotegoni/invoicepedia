import { selectInvoiceType } from "@/db/schema";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface Props extends Pick<selectInvoiceType, "status"> {
  className?: string;
}

export default function StatusBadge({ status, className }: Props) {
  return (
    <Badge
      className={cn(
        "rounded-full",
        status === "open" && "bg-blue-500",
        status === "paid" && "bg-green-600",
        status === "void" && "bg-zinc-700",
        status === "uncollectible" && "bg-red-600",
        className
      )}
    >
      {status}
    </Badge>
  );
}
