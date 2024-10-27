"use server";

import { signIn, signOut } from "@/auth";
import { loginFormSchema, registerUserFormSchema } from "../schemas";
import { prisma } from "../../../prisma/prisma";
import { createId } from "@paralleldrive/cuid2";
import { genSalt, hashSync } from "bcrypt-ts";

export type FormResponse = {
  success?: boolean;
  message?: string;
  fields?: Record<string, string | number | boolean | Date>;
};

export const registerUser = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  const parsedData = registerUserFormSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message:
        "Registration failed. Please check the form for errors or try again later.",
      fields: parsedData.data,
    };
  }

  const { name, email, password } = parsedData.data;

  try {
    const isEmailUnique = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isEmailUnique) {
      return {
        success: false,
        message: "Email address is already registered to another user",
        fields: parsedData.data,
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = hashSync(password, salt);
    await prisma.user.create({
      data: {
        id: createId(),
        email: email,
        name: name,
        password: hashedPassword,
      },
    });
    return {
      success: true,
      message:
        "Registration successful! Welcome aboard. You can now log in to access your account.",
    };
  } catch (error) {
    console.error("Registration failed: ", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export const credentialsLogin = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  const parsedData = loginFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Invalid credentials");
  }

  const { email, password } = parsedData.data;

  try {
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
      message: "Login successful. Redirecting...",
    };
  } catch (error) {
    console.error("Login failed: ", error);

    return {
      success: false,
      message: "Invalid Credentials",
      fields: parsedData.data,
    };
  }
};

export const oAuthLogin = async (formData: FormData) => {
  const provider = formData.get("action") as string;
  await signIn(provider, { redirectTo: "/dashboard" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};
