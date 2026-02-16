"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
