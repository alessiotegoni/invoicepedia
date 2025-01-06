"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full font-semibold" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Submitting
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
}
