import Container from "@/components/Container";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main>
      <Container className="flex-center">
        <SignUp />
      </Container>
    </main>
  );
}
