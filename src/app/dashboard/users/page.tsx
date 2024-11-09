import { ForbiddenPage } from "@/components/features/forbidden";
import { FormDialog } from "@/components/features/form-dialog";
import { UserForm } from "@/components/features/users/user-form";
import { userColumns } from "@/components/features/users/users-column";
import { DataTable } from "@/components/ui/data-table";
import { getSessionInfo, getUsers } from "@/lib/actions/user-actions";
import { User } from "@prisma/client";

const UsersPage = async () => {
  const { userRole } = await getSessionInfo();
  if (userRole !== "Admin") return <ForbiddenPage />;

  const users: User[] = await getUsers();
  const noRoleUsers = users.filter((user) => user.role === "None");
  const roleUsers = users.filter((user) => user.role !== "None");

  return (
    <div className="p-2 space-y-5">
      <div className="flex items-center justify-end">
        <FormDialog buttonLabel="Add User" formTitle="New User">
          <UserForm />
        </FormDialog>
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
