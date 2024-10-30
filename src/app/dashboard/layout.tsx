import { Header } from "@/components/features/dashboard/header";
import { SideBar } from "@/components/features/dashboard/sidebar";
import { getUserRole } from "@/lib/actions/user-actions";
import { Role } from "@prisma/client";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const role: Role = await getUserRole();

  return (
    <div className="grid md:grid-cols-[auto_1fr]">
      <Header />
      <SideBar role={role} />
      <main className="min-h-[calc(100dvh-56px)] overflow-x-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
