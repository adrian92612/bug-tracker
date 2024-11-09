"use server";

import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../../../prisma/prisma";
import { projectFormSchema } from "../schemas";
import { FormResponse } from "./auth-actions";
import { revalidatePath } from "next/cache";
import {
  Project,
  ProjectAssignment,
  ProjectStatus,
  Ticket,
  User,
} from "@prisma/client";

export type ProjectWithOMT = Project & {
  owner: Pick<User, "id" | "name" | "email">;
  members: {
    user: Pick<User, "id" | "name" | "email" | "role">;
  }[];
  tickets: Pick<Ticket, "id" | "title" | "status" | "priority">[];
};

export type FullProjectDetails = Project & {
  owner: User;
  members: (ProjectAssignment & {
    user: User;
  })[];
  tickets: Ticket[];
};

export const getProject = async (
  id: string
): Promise<FullProjectDetails | null> => {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tickets: true,
      },
    });
  } catch (error) {
    console.error("Failed to get project details: ", error);
    return null;
  }
};

export const getProjects = async (
  userId?: string
): Promise<ProjectWithOMT[]> => {
  try {
    if (userId) {
      return await prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          tickets: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
            },
          },
        },
      });
    } else {
      return await prisma.project.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          tickets: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Failed to get projects: ", error);
    return [];
  }
};

export const upsertProject = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);

  const deadlineDate = new Date(data.deadline as string);

  const parsedData = projectFormSchema.safeParse({
    ...data,
    deadline: deadlineDate,
  });

  if (!parsedData.success) {
    return {
      success: false,
      message: `Failed to ${
        data.id ? "update" : "create"
      } project, please check the form for errors.`,
      fields: parsedData.data,
    };
  }
  const { id, ownerId, name, description, deadline } = parsedData.data;
  try {
    if (id) {
      await prisma.project.update({
        where: { id },
        data: {
          name,
          description,
          deadline,
        },
      });
    } else {
      await prisma.project.create({
        data: {
          id: createId(),
          ownerId,
          name,
          description,
          deadline,
        },
      });
    }

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);
    return {
      success: true,
      message: `Project ${name} has been ${
        id ? "updated" : "created"
      } successfully`,
      fields: parsedData.data,
    };
  } catch (error) {
    console.error(`Failed to ${id ? "update" : "create"} project: `, error);
    return {
      success: false,
      message: `Failed to ${
        id ? "update" : "create"
      } project ${name}, try again later`,
      fields: parsedData.data,
    };
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath("/dashboard/projects");
    return true;
  } catch (error) {
    console.error("Failed to delete project: ", error);
    return false;
  }
};

export const changeProjectStatus = async (
  projectId: string,
  status: ProjectStatus
) => {
  try {
    const currentDate = new Date();
    await prisma.$transaction(async (tx) => {
      // Step 1: Retrieve the project deadline
      const project = await tx.project.findUnique({
        where: { id: projectId },
        select: { deadline: true },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Step 2: Determine status based on deadline
      const updatedStatus =
        currentDate > project.deadline ? ProjectStatus.Overdue : status;

      // Step 3: Update project status
      await tx.project.update({
        where: { id: projectId },
        data: { status: updatedStatus },
      });
    });
    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to update project status: ", error);
  }
};
