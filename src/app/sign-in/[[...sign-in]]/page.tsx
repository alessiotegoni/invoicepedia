"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br p-4">
      <SignIn.Root>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
        >
          <SignIn.Step name="start" className="space-y-6 p-8">
            <header className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto size-12"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </motion.div>
              <h1 className="mt-4 text-2xl font-bold">
                Sign in to Invoicipedia
              </h1>
            </header>
            <Clerk.GlobalError className="text-sm text-red-600" />
            <Clerk.Field name="identifier">
              <Clerk.Label className="sr-only">Email</Clerk.Label>
              <Clerk.Input
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-500 "
              />
              <Clerk.FieldError className="mt-2 text-xs text-red-600" />
            </Clerk.Field>
            <SignIn.Action submit asChild>
              <Button
                className="w-full py-3 font-semibold focus:outline-none focus:ring-2
              focus:ring-offset-2"
              >
                Sign In
              </Button>
            </SignIn.Action>

            <p className="px-2 text-center my-5">Or continue with</p>

            <div className="grid gap-3">
              {/* <SignIn.Passkey asChild>
                <Button variant="outline" className="w-full">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Continue with Passkey
                </Button>
              </SignIn.Passkey> */}
              <Clerk.Connection name="google" asChild>
                <Button variant="outline" className="w-full">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Login with Google
                </Button>
              </Clerk.Connection>
            </div>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href={String(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </SignIn.Step>
          <SignIn.Step name="verifications" className="space-y-6 p-8">
            <SignIn.Strategy name="email_code">
              <VerificationStep
                title="Verify email code"
                fieldName="code"
                placeholder="Email code"
                buttonText="Continue"
              />
            </SignIn.Strategy>
            <SignIn.Strategy name="phone_code">
              <VerificationStep
                title="Verify phone code"
                fieldName="code"
                placeholder="Phone code"
                buttonText="Login"
              />
            </SignIn.Strategy>
            <SignIn.Strategy name="totp">
              <VerificationStep
                title="Verify Authenticator Code"
                fieldName="code"
                placeholder="Authenticator code"
                buttonText="Log In"
                otpInput
              />
            </SignIn.Strategy>
          </SignIn.Step>
        </motion.div>
      </SignIn.Root>
    </div>
  );
}

type VerificationStepProps = {
  title: string;
  fieldName: string;
  placeholder: string;
  buttonText: string;
  otpInput?: boolean;
};

function VerificationStep({
  title,
  fieldName,
  placeholder,
  buttonText,
  otpInput = false,
}: VerificationStepProps) {
  return (
    <>
      <header className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="mx-auto h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      </header>
      <Clerk.GlobalError className="text-sm text-red-600" />
      <Clerk.Field name={fieldName}>
        <Clerk.Label className="sr-only">{placeholder}</Clerk.Label>
        {otpInput ? (
          <Clerk.Input
            type="otp"
            required
            className="flex justify-center gap-2"
            render={({ value, status }) => (
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative h-12 w-10 rounded-md bg-white ring-1 ring-inset ${
                      status === "selected"
                        ? "ring-indigo-600"
                        : "ring-gray-300"
                    }`}
                  >
                    <AnimatePresence>
                      {value && value[index] && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 flex items-center justify-center text-lg font-semibold"
                        >
                          {value[index]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          />
        ) : (
          <Clerk.Input
            type="text"
            required
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
          />
        )}
        <Clerk.FieldError className="mt-2 text-xs text-red-600" />
      </Clerk.Field>
      <SignIn.Action submit asChild>
        <Button className="w-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {buttonText}
        </Button>
      </SignIn.Action>
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
