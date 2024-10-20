"use server";

import { User } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { auth } from "@/auth";

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
