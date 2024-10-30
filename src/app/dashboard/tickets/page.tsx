import { FormDialog } from "@/components/features/form-dialog";
import { TicketForm } from "@/components/features/tickets/ticket-form";
import TicketKanban from "@/components/features/tickets/ticket-kanban";

import {
  getAllTickets,
  getProjectsForTicketForm,
} from "@/lib/actions/ticket-actions";
import { getUserRole } from "@/lib/actions/user-actions";

const TicketsPage = async () => {
  const projects = await getProjectsForTicketForm();
  const tickets = await getAllTickets();
  const role = await getUserRole();
  console.log("ROLE", role);
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
