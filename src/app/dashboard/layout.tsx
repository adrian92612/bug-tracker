import { Header } from "@/components/features/dashboard/header";
import { SideBar } from "@/components/features/dashboard/sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="grid md:grid-cols-[auto_1fr]">
      <Header />
      <SideBar />
      <main className="h-[200dvh]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
