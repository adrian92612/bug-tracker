import { Header } from "@/components/features/dashboard/header";
import { SideBar } from "@/components/features/dashboard/sidebar";
import { getUserRole } from "@/lib/actions/user-actions";
import { Role } from "@prisma/client";
import { UserRoleProvider } from "../../../context/role-provider";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const role: Role = await getUserRole();

  return (
    <UserRoleProvider role={role}>
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
