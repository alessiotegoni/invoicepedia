import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

type Props = {
  onClick?: () => void;
};

export default function DeleteButton({ onClick }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="destructive"
      className="mb-2 sm:mb-0"
      type="submit"
      onClick={onClick}
      disabled={pending}
    >
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Deleting
        </>
      ) : (
        "Delete"
      )}
    </Button>
  );
}
