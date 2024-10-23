"use server";

import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../../../prisma/prisma";
import { createProjectSchema } from "../schemas";
import { FormResponse } from "./auth-actions";

export const createProject = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  const parsedData = createProjectSchema.safeParse(data);
  console.log(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: "Failed to create project, please check the form for errors.",
      fields: {},
    };
  }
  const { ownerId, name, description } = parsedData.data;
  try {
    await prisma.project.create({
      data: {
        id: createId(),
        ownerId,
        name,
        description,
      },
    });

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
