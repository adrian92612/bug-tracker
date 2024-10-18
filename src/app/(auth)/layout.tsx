type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <header>
        <h1>LOGO</h1>
      </header>
      <main>{children}</main>
    </>
  );
};

export default AuthLayout;
