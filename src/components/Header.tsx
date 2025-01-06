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

export default function Header() {
  return (
    <header className="mt-8 mb-12">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex-center gap-4">
            <h1 className="font-bold text-3xl">
              <Link href="/dashboard">Invoicepedia</Link>
            </h1>
            <span className="text-slate-300 text-2xl">/</span>
            <SignedIn>
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
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </Container>
    </header>
  );
}
