import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoMdPersonAdd } from "react-icons/io";

const UsersPage = () => {
  return (
    <div className="p-2">
      <div className="flex items-center justify-end">
        <Button asChild variant="tertiary" size="sm">
          <Link href="/dashboard/users/add">
            <IoMdPersonAdd /> Add User
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
