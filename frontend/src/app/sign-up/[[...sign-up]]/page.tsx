import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
export default async function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-transparent p-4 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign Up</h1>
        <div className=" border-border/70 mx-auto p-2 text-base">
          <Suspense fallback={<div>Loading...</div>}>
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              fallbackRedirectUrl={"/"}
            />
          </Suspense>
        </div>
        {/* <p className="mt-8 text-xs text-center hover:underline text-muted-foreground">
          Already have an account?
          <Link
            className="font-medium text-primary hover:text-primary/90"
            href={"/sign-in"}
          >
            {" "}
            Sign In
          </Link>
        </p> */}
      </div>
    </div>
  );
}
