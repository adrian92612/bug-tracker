"use server";

import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../../../prisma/prisma";
import { createProjectSchema } from "../schemas";
import { FormResponse } from "./auth-actions";
import { revalidatePath } from "next/cache";

export const createProject = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);

  const deadlineDate = new Date(data.deadline as string);

  const parsedData = createProjectSchema.safeParse({
    ...data,
    deadline: deadlineDate,
  });
  console.log(parsedData.data);

  if (!parsedData.success) {
    console.log(parsedData.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Failed to create project, please check the form for errors.",
      fields: {},
    };
  }
  const { ownerId, name, description, deadline } = parsedData.data;
  try {
    await prisma.project.create({
      data: {
        id: createId(),
        ownerId,
        name,
        description,
        deadline,
      },
    });

    revalidatePath("/dashboard/projects");
    return {
      success: true,
      message: `Project ${name} has been created successfully`,
    };
  } catch (error) {
    console.error("Failed to create project: ", error);
    return {
      success: false,
      message: `Failed to create project ${name}, try again later`,
      fields: {},
    };
  }
};
