"use client";

import { Role } from "@prisma/client";
import { createContext, useContext } from "react";

type UserRoleContextType = {
  role: Role;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

type UserRoleProviderProps = {
  role: Role;
  children: React.ReactNode;
};

export const UserRoleProvider = ({ role, children }: UserRoleProviderProps) => {
  return (
    <UserRoleContext.Provider value={{ role }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context.role;
};
