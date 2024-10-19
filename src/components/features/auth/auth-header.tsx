"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AuthHeader = () => {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  console.log(pathname);
  return (
    <header className="h-14 px-5 flex items-center justify-between bg-blue-600">
      <Link href="/">
        <h1 className="font-bold">ProjectSync</h1>
      </Link>

      <Button asChild variant="secondary">
        <Link href={isLogin ? "/register" : "/login"}>
          {isLogin ? "Register" : "Login"}
        </Link>
      </Button>
    </header>
  );
};
