import { Header } from "@/components/features/header";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
