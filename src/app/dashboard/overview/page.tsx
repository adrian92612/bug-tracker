import { auth } from "@/auth";

const OverviewPage = async () => {
  const session = await auth();
  return (
    <div className="grid h-full place-items-center">
      OverviewPage
      {JSON.stringify(session?.user)}
    </div>
  );
};

export default OverviewPage;
