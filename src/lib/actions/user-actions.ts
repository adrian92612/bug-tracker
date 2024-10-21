"use server";

import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { auth } from "@/auth";
import { FormResponse } from "./auth-actions";
import { addUserFormSchema } from "../schemas";
import { genSalt, hashSync } from "bcrypt-ts";
import { createId } from "@paralleldrive/cuid2";

export const getUserId = async (): Promise<string | undefined> => {
  const session = await auth();
  return session?.user?.id;
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userId = await getUserId();
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Failed to get user: ", error);
    return null;
  }
};

export const addUser = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  const parsedData = addUserFormSchema.safeParse(data);
  console.log("DATA", data);
  console.log("parsedData", parsedData);

  if (!parsedData.success) {
    console.log(parsedData.error.flatten().fieldErrors);
    return {
      success: false,
      message:
        "Add user failed. Please check the form for errors or try again later.",
      fields: parsedData.data,
    };
  }
  const { role, name, email, password } = parsedData.data;
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
        role,
        email,
        name,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User added successfully!",
    };
  } catch (error) {
    console.error("Failed to add user: ", error);
    return {
      success: false,
      message: "Failed to add user, try again later.",
      fields: parsedData.data,
    };
  }
};
