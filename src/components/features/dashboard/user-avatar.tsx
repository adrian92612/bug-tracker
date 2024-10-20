import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@prisma/client";
import { logout } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/actions/user-actions";

type UserAvatarProps = {
  user: User;
};

export const UserAvatar = async () => {
  const user = await getUser();
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback>
            <IoPersonOutline className="size-6" />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/settings">Settings</Link>
          </Button>
          <form action={logout}>
            <Button variant="destructive" size="sm" className="w-full">
              Logout
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
