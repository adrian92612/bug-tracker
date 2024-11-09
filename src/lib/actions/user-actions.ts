"use server";

import { Role, User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { auth } from "@/auth";
import { FormResponse } from "./auth-actions";
import { addUserFormSchema, editUserFormSchema } from "../schemas";
import { genSalt, hashSync } from "bcrypt-ts";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

type SessionInfo = {
  userId: string | undefined;
  userRole: Role | undefined;
};

export const getSessionInfo = async (): Promise<SessionInfo> => {
  const session = await auth();
  return {
    userId: session?.user.id,
    userRole: session?.user.role,
  };
};

export const getUser = async (id?: string): Promise<User | null> => {
  try {
    if (id) {
      return await prisma.user.findUnique({
        where: { id: id },
      });
    } else {
      const { userId } = await getSessionInfo();
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

export const upsertUser = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  const parsedData = data.id
    ? editUserFormSchema.safeParse(data)
    : addUserFormSchema.safeParse(data);

  console.log(data);
  console.log(parsedData.data);
  if (!parsedData.success) {
    return {
      success: false,
      message: `${
        data.id ? "Update" : "Create"
      } user failed. Please check the form for errors or try again later.`,
      fields: parsedData.data,
    };
  }

  const { id, role, name, email, password } = parsedData.data;

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: {
          name,
          role: role as Role,
        },
      });
    } else {
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
      const hashedPassword = hashSync(password!, salt);

      await prisma.user.create({
        data: {
          id: createId(),
          role: role as Role,
          email: email!,
          name,
          password: hashedPassword,
        },
      });
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    return {
      success: true,
      message: `${name} ${id ? "updated" : "created"} successfully!`,
      fields: parsedData.data,
    };
  } catch (error) {
    console.error(`Failed to ${id ? "update" : "create"} user: `, error);
    return {
      success: false,
      message: `Failed to ${id ? "update" : "create"} user, try again later.`,
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
