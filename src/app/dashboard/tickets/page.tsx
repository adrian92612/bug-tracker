import { FormDialog } from "@/components/features/form-dialog";
import { TicketForm } from "@/components/features/tickets/ticket-form";
import TicketKanban from "@/components/features/tickets/ticket-kanban";

import {
  getProjectsForTicketForm,
  getTickets,
} from "@/lib/actions/ticket-actions";
import { getSessionInfo } from "@/lib/actions/user-actions";
import { redirect } from "next/navigation";

const TicketsPage = async () => {
  const { userId, userRole } = await getSessionInfo();
  if (!userId || !userRole) redirect("/login");

  const isAdmin = userRole === "Admin";

  const [projects, tickets] = await Promise.all([
    getProjectsForTicketForm(),
    getTickets(isAdmin ? undefined : userId),
  ]);

  return (
    <div>
      <FormDialog buttonLabel="Create a Ticket" formTitle="New Ticket">
        <TicketForm projects={projects} />
      </FormDialog>
      <TicketKanban tickets={tickets} projects={projects} />
    </div>
  );
};

export default TicketsPage;
