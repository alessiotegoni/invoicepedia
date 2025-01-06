import { getCustomers } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NewInvoiceForm from "./NewInvoiceForm";
import Container from "@/components/Container";

export const metadata = {
  title: "New invoice",
};

export default async function NewInvoice() {
  const { userId, orgId } = await auth();

  if (!userId) redirect("/sign-in");

  const results = await getCustomers(userId, orgId);

  return (
    <main className="h-full">
      <Container className="max-w-sm flex flex-col justify-center">
        <h1 className="text-3xl font-semibold mb-5">Create Invoice</h1>
        <NewInvoiceForm customers={results} />
      </Container>
    </main>
  );
}
