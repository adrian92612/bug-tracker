import { auth } from "@/auth";
import { FormDialog } from "@/components/features/form-dialog";
import { TicketForm } from "@/components/features/tickets/ticket-form";
import TicketKanban from "@/components/features/tickets/ticket-kanban";

import {
  getProjectsForTicketForm,
  getTickets,
} from "@/lib/actions/ticket-actions";

const TicketsPage = async () => {
  const session = await auth();
  const userId = session?.user.id;
  const userRole = session?.user.role;
  const isAdmin = userRole === "ADMIN";

  const [projects, tickets] = await Promise.all([
    getProjectsForTicketForm(),
    getTickets(isAdmin ? undefined : userId),
  ]);
  console.log(userId);
  console.log(tickets.length);

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
