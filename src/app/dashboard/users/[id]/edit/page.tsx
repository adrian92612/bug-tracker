import { EditUserForm } from "@/components/features/users/edit-user-form";
import { getUser } from "@/lib/actions/user-actions";

const EditUserPage = async () => {
  const user = await getUser();
  if (!user) return <div>No User Found</div>;
  return (
    <div className="min-h-full grid place-items-center">
      <EditUserForm user={user} />;
    </div>
  );
};

export default EditUserPage;
