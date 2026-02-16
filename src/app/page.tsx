import { getSession } from "@/lib/auth-session";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, UserPlus, Shield } from "lucide-react";

export default async function Home() {
  const session = await getSession();

  const user = session?.user as
    | { name: string; email: string; role?: string }
    | undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <main className="flex w-full max-w-lg flex-col items-center text-center">
        {session && user ? (
          <>
            {/* Authenticated State */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
              <Shield className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {user.name}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              You are signed in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize">
                {user.role || "user"}
              </span>
            </div>

            <div className="mt-8 flex gap-3">
              {user.role === "admin" && (
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
              <SignOutButton />
            </div>
          </>
        ) : (
          <>
            {/* Guest State */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
              <Shield className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to the App
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              A Next.js boilerplate with BetterAuth authentication, role-based
              access control, and Drizzle ORM with Neon PostgreSQL.
            </p>

            <div className="mt-8 flex gap-3">
              <Button asChild size="lg">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
