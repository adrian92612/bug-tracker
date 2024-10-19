"use server";

import { signIn, signOut } from "@/auth";

export const oAuthLogin = async (formData: FormData) => {
  const provider = formData.get("action") as string;
  await signIn(provider, { redirectTo: "/dashboard" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};
