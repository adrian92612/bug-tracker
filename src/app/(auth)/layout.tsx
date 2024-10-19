import { AuthHeader } from "@/components/features/auth/auth-header";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <AuthHeader />
      <main className="min-h-dvh grid place-items-center px-2">{children}</main>
    </>
  );
};

export default AuthLayout;
