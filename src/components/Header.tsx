import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Container from "./Container";
import Link from "next/link";
import { ToggleTheme } from "./ToggleTheme";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="mt-8 mb-12">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex-center gap-4">
            <h1 className="font-bold text-3xl">
              <Link href="/dashboard">Invoicepedia</Link>
            </h1>
            <SignedIn>
              <span className="text-slate-300 text-2xl">/</span>
              <span className="-ml-2">
                <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
              </span>
            </SignedIn>
          </div>
          <div className="flex items-center gap-4">
            <ToggleTheme />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button asChild>
                <SignInButton />
              </Button>
            </SignedOut>
          </div>
        </div>
      </Container>
    </header>
  );
}
