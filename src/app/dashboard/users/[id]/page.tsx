import { ForbiddenPage } from "@/components/features/forbidden";
import { getSessionInfo, getUser } from "@/lib/actions/user-actions";

type UserPageProps = {
  params: {
    id: string;
  };
};

const UserPage = async ({ params }: UserPageProps) => {
  const { userRole } = await getSessionInfo();
  if (userRole !== "Admin") return <ForbiddenPage />;

  const user = await getUser(params.id);
  return (
    <div>
      UserPage
      {JSON.stringify(user)}
    </div>
  );
};

export default UserPage;
