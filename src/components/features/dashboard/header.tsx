import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";
import { UserAvatar } from "./user-avatar";
import { Input } from "@/components/ui/input";
import { SideBarSheet } from "./sidebar";

export const Header = async () => {
  return (
    <header className="h-14 px-2 md:px-5 md:col-span-2 flex items-center bg-blue-600 gap-10 sticky top-0">
      <div className="flex items-center justify-end gap-2">
        <SideBarSheet />
        <Link href="/dashboard/overview" className="hidden md:block">
          <h1 className="font-bold text-slate-50">ProjectSync</h1>
        </Link>
      </div>

      <div className="flex items-center justify-end gap-2 grow">
        <Input
          placeholder="Search..."
          className="max-w-60 grow border-b-slate-50 bg-slate-50"
        />
        <IoIosNotifications className="text-4xl text-slate-50 shrink-0" />
        <UserAvatar />
      </div>
    </header>
  );
};
