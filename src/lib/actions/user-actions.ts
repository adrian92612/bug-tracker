"use server";

import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { auth } from "@/auth";
import { FormResponse } from "./auth-actions";
import { addUserFormSchema, editUserFormSchema } from "../schemas";
import { genSalt, hashSync } from "bcrypt-ts";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

export const getUserId = async (): Promise<string | undefined> => {
  const session = await auth();
  return session?.user?.id;
};

export const getUser = async (id?: string): Promise<User | null> => {
  try {
    if (id) {
      return await prisma.user.findUnique({
        where: { id: id },
      });
    } else {
      const userId = await getUserId();
      return await prisma.user.findUnique({
        where: { id: userId },
      });
    }
  } catch (error) {
    console.error("Failed to get user: ", error);
    return null;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany({});
  } catch (error) {
    console.error("Failed to get users: ", error);
    return [];
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

    revalidatePath("/dashboard/users");
    return {
      success: true,
      message: `${name} has been added successfully!`,
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

export const editUser = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  const parsedData = editUserFormSchema.safeParse(data);
  console.log("sdkjfjhsdalfhsdakfhsdlkfhj");
  console.log("DATA", data);
  console.log("parsedData", parsedData);

  if (!parsedData.success) {
    console.log(parsedData.error.flatten().fieldErrors);
    return {
      success: false,
      message:
        "Edit user failed. Please check the form for errors or try again later.",
      fields: parsedData.data,
    };
  }
  const { id, role, name } = parsedData.data;

  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role,
        name,
      },
    });

    revalidatePath(`/dashboard/users/${id}/edit`);
    return {
      success: true,
      message: "User updated successfully!",
      fields: parsedData.data,
    };
  } catch (error) {
    console.error("Failed to update user: ", error);
    return {
      success: false,
      message: "Failed to update user, try again later.",
      fields: parsedData.data,
    };
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard/users");
    return true;
  } catch (error) {
    console.error("Failed to delete user: ", error);
    return false;
  }
};
