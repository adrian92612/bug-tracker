import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";
import { UserAvatar } from "./user-avatar";
import { Input } from "@/components/ui/input";

export const Header = async () => {
  return (
    <header className="h-14 px-5 flex items-center bg-blue-600 gap-10">
      <Link href="/dashboard">
        <h1 className="font-bold">ProjectSync</h1>
      </Link>

      <div className="flex items-center justify-end gap-2 grow">
        <Input
          placeholder="Search..."
          className="max-w-60 grow border-b-slate-50 bg-slate-50"
        />
        <IoIosNotifications className="size-10 text-slate-50 shrink-0" />
        <UserAvatar />
      </div>
    </header>
  );
};
