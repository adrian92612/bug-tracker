import { userColumns } from "@/components/features/users/users-column";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getUsers } from "@/lib/actions/user-actions";
import Link from "next/link";
import { IoMdPersonAdd } from "react-icons/io";

const UsersPage = async () => {
  const users = await getUsers();
  const noRoleUsers = users.filter((user) => user.role === "USER");
  const roleUsers = users.filter((user) => user.role !== "USER");
  console.log(users);
  return (
    <div className="p-2 space-y-5">
      <div className="flex items-center justify-end">
        <Button asChild variant="tertiary" size="sm">
          <Link href="/dashboard/users/add">
            <IoMdPersonAdd /> Add User
          </Link>
        </Button>
      </div>

      <div className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-2 gap-5">
        <div>
          <DataTable
            columns={userColumns}
            data={noRoleUsers}
            className="bg-green-200"
            tableName="Available Personnel"
          />
        </div>

        <div>
          <DataTable
            columns={userColumns}
            data={roleUsers}
            className="bg-amber-200"
            tableName="Occupied Personnel"
          />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
