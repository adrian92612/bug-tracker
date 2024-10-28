"use server";
import { z } from "zod";
import { FormResponse } from "./auth-actions";
import { Project, Ticket } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { ticketFormSchema } from "../schemas";
import { createId } from "@paralleldrive/cuid2";
import { getUserId } from "./user-actions";
import { revalidatePath } from "next/cache";

export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    return await prisma.ticket.findMany();
  } catch (error) {
    console.error("Failed to get tickets: ", error);
    return [];
  }
};

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

    revalidatePath("/dashboard/tickets");
    revalidatePath(`/dashboard/tickets/${id}`);
    return {
      success: true,
      message: "Success",
      fields: parsedData.data,
    };
  } catch (error) {
    console.error(`Failed to create ticket: `, error);
    return {
      success: false,
      message: "Failed",
      fields: parsedData.data,
    };
  }
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  try {
    await prisma.ticket.delete({
      where: { id },
    });
    revalidatePath("/dashboard/tickets");
    return true;
  } catch (error) {
    console.error("Failed to delete ticket: ", error);
    return false;
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
