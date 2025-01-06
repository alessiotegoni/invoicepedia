"use client";

import { useEffect } from "react";
import Container from "@/components/Container";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // return <NextError statusCode={500} title={error.message} />;
  return (
    <main>
      <Container className="flex-col flex-center">
        <h1 className="text-4xl font-bold mb-4">{error.name}</h1>
        <p>{error.message}</p>
      </Container>
    </main>
  );
}
