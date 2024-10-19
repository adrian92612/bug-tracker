import Link from "next/link";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions/actions";

export const Header = () => {
  return (
    <header className="h-14 px-5 flex items-center justify-between bg-blue-600">
      <Link href="/dashboard">
        <h1 className="font-bold">ProjectSync</h1>
      </Link>

      <form action={logout}>
        <Button variant="destructive">Logout</Button>
      </form>
    </header>
  );
};
