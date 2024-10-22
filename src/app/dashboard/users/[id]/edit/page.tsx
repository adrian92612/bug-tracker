import { EditUserForm } from "@/components/features/users/edit-user-form";
import { getUser } from "@/lib/actions/user-actions";

type EditUserPageProps = {
  params: {
    id: string;
  };
};

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const user = await getUser(params.id);
  console.log("EDIT USER: ", user);
  if (!user) return <div>No User Found</div>;
  return (
    <div className="min-h-full grid place-items-center">
      <EditUserForm user={user} />;
    </div>
  );
};

export default EditUserPage;
