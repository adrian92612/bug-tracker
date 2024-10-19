import { auth } from "@/auth";
import { prisma } from "../../../prisma/prisma";

const DashboardPage = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  console.log(session);

  return (
    <div>
      DashboardPage
      <p>{JSON.stringify(session)}</p>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
};

export default DashboardPage;
