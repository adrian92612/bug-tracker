"use server";
import { z } from "zod";
import { FormResponse } from "./auth-actions";
import { Project } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { ticketFormSchema } from "../schemas";
import { createId } from "@paralleldrive/cuid2";
import { getUserId } from "./user-actions";

export const upsertTicket = async (
  state: FormResponse,
  formData: FormData
): Promise<FormResponse> => {
  const data = Object.fromEntries(formData);
  console.log(data);
  const parsedData = ticketFormSchema.safeParse(data);
  console.log(parsedData);

  if (!parsedData.success) {
    console.log(parsedData.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Failed",
      fields: parsedData.data,
    };
  }
  const { id, projectId, title, description, type, priority } = parsedData.data;
  try {
    if (id) {
      await prisma.ticket.update({
        where: { id },
        data: {
          projectId,
          title,
          description,
          type,
          priority,
        },
      });
    } else {
      const userId = await getUserId();
      if (!userId) throw new Error("User Id not found");
      await prisma.ticket.create({
        data: {
          id: createId(),
          projectId,
          title,
          description,
          type,
          priority,
          createdById: userId,
        },
      });
    }
    return {
      success: true,
      message: "Success",
      fields: {},
    };
  } catch (error) {
    console.error(`Failed to create ticket: `, error);
    return {
      success: false,
      message: "Failed",
      fields: {},
    };
  }
};

export const getProjectsForTicketForm = async (): Promise<Project[]> => {
  try {
    return await prisma.project.findMany({});
  } catch (error) {
    console.error("Failed to get project names and ids: ", error);
    return [];
  }
};
