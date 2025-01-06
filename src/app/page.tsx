import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-full">
      <Container className="flex flex-col justify-center items-center h-full gap-4">
        <h1 className="text-5xl font-bold">Invoicepedia</h1>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </Container>
    </main>
  );
}
