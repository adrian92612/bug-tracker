"use server";

import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../../../prisma/prisma";
import { projectFormSchema } from "../schemas";
import { FormResponse } from "./auth-actions";
import { revalidatePath } from "next/cache";
import { Project, Ticket, User } from "@prisma/client";

export type ProjectWithOMT = Project & {
  owner: Pick<User, "id" | "name" | "email">;
  members: {
    user: Pick<User, "id" | "name" | "email" | "role">;
  }[];
  tickets: Pick<Ticket, "id" | "title" | "status" | "priority">[];
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
// export const getProjects = async (): Promise<ProjectWithOMT[]> => {
//   try {
//     return await prisma.project.findMany({
//       include: {
//         owner: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         members: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//               },
//             },
//           },
//         },
//         tickets: {
//           select: {
//             id: true,
//             title: true,
//             status: true,
//             priority: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Failed to get projects: ", error);
//     return [];
//   }
// };

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
