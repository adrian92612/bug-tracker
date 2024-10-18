type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <header>LOGO</header>
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
