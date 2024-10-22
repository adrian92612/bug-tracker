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
      <main className="min-h-[calc(100dvh-56px)] overflow-x-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
