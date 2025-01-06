import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InvoiceCreatedEmailProps {
  invoiceId: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const InvoiceCreatedEmail = ({
  invoiceId,
}: InvoiceCreatedEmailProps) => (
  <>
    <Head />
    <Preview>Your new invoice from Space Jelly</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans" lang="en">
        <Container className="max-w-xl mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden">
          <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
            <Img
              src={`${baseUrl}/invoicepedia-logo.png`}
              width="60"
              height="60"
              alt="Invoicepedia Logo"
              className="mx-auto mb-4"
            />
            <Heading className="text-2xl font-bold text-white mb-2">
              New Invoice
            </Heading>
            <Text className="text-black text-2xl font-semibold">
              Invoice #{invoiceId} is ready for payment
            </Text>
          </Section>
          <Section className="px-8 py-10">
            <Text className="text-gray-700 text-lg mb-6">Hello there,</Text>
            <Text className="text-gray-700 mb-6">
              A new invoice has been generated for your recent services with{" "}
              <strong>Space Jelly</strong>. Please review the details and
              process the payment at your earliest convenience.
            </Text>

            <Button
              className="bg-blue-600 text-white text-base font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out"
              href={`${baseUrl}/invoices/${invoiceId}/payment`}
            >
              View and Pay Invoice
            </Button>
          </Section>
          <Hr className="border-t border-gray-200 my-6 mx-8" />
          <Section className="px-8 py-6 bg-gray-50 text-center">
            <Text className="text-gray-600 text-sm">
              If you have any questions, please don&apos;t hesitate to{" "}
              <Link
                href="mailto:support@spacejelly.dev"
                className="text-blue-600 hover:underline"
              >
                contact our support team
              </Link>
              .
            </Text>
          </Section>
          <Section className="px-8 py-6 text-center">
            <Link
              href="https://spacejelly.dev"
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              © 2023 Space Jelly. All rights reserved.
            </Link>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </>
);

InvoiceCreatedEmail.PreviewProps = {
  invoiceId: 1234,
} as InvoiceCreatedEmailProps;

export default InvoiceCreatedEmail;
