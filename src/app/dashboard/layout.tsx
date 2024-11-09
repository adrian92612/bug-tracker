import { Header } from "@/components/features/dashboard/header";
import { SideBar } from "@/components/features/dashboard/sidebar";
import { getSessionInfo } from "@/lib/actions/user-actions";
import { UserRoleProvider } from "../../../context/role-provider";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { userRole } = await getSessionInfo();
  if (!userRole) redirect("/login");
  return (
    <UserRoleProvider role={userRole}>
      <div className="grid md:grid-cols-[auto_1fr]">
        <Header />
        <SideBar />
        <main className="min-h-[calc(100dvh-56px)] overflow-x-auto">
          {children}
        </main>
      </div>
    </UserRoleProvider>
  );
};

export default DashboardLayout;
