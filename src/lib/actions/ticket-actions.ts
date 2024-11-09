"use server";
import { FormResponse } from "./auth-actions";
import {
  Project,
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketType,
  User,
} from "@prisma/client";
import { prisma } from "../../../prisma/prisma";
import { ticketFormSchema } from "../schemas";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";
import { getSessionInfo } from "./user-actions";

export const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    return await prisma.ticket.findMany();
  } catch (error) {
    console.error("Failed to get tickets: ", error);
    return [];
  }
};

export const getTicket = async (id: string): Promise<Ticket | null> => {
  try {
    return await prisma.ticket.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get ticket: ", error);
    return null;
  }
};

export const getTicketMembers = async (id: string): Promise<User[]> => {
  try {
    const ticketMembers = await prisma.ticketAssignment.findMany({
      where: { ticketId: id },
      include: {
        user: true,
      },
    });

    if (!ticketMembers.length) {
      throw new Error("No members found for this ticket.");
    }

    return ticketMembers.map((tm) => tm.user);
  } catch (error) {
    console.error("Failed to get ticket members: ", error);
    return [];
  }
};

export const getTickets = async (userId?: string): Promise<Ticket[]> => {
  try {
    if (userId) {
      return await prisma.ticket.findMany({
        where: {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
      });
    } else {
      return await prisma.ticket.findMany();
    }
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
  const { id, projectId, title, description, type, priority, assignedToId } =
    parsedData.data;
  try {
    if (id) {
      await prisma.ticket.update({
        where: { id },
        data: {
          projectId,
          title,
          description,
          type: type as TicketType,
          priority: priority as TicketPriority,
          assignedToId,
        },
      });
    } else {
      const { userId } = await getSessionInfo();
      if (!userId) throw new Error("User Id not found");
      await prisma.ticket.create({
        data: {
          id: createId(),
          projectId,
          title,
          description,
          type: type as TicketType,
          priority: priority as TicketPriority,
          createdById: userId,
          assignedToId,
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

type updateTicketStatusProps = {
  id: string;
  status: TicketStatus;
};

export const updateTicketStatus = async ({
  id,
  status,
}: updateTicketStatusProps): Promise<boolean> => {
  try {
    console.log(id, status);
    await prisma.ticket.update({
      where: { id },
      data: {
        status,
      },
    });
    revalidatePath("/dashboard/tickets");
    return true;
  } catch (error) {
    console.error("Failed to update ticket status: ", error);
    return false;
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
