import { FormDialog } from "@/components/features/form-dialog";
import { TicketForm } from "@/components/features/tickets/ticket-form";
import TicketKanban from "@/components/features/tickets/ticket-kanban";

import {
  getAllTickets,
  getProjectsForTicketForm,
} from "@/lib/actions/ticket-actions";

const TicketsPage = async () => {
  const [projects, tickets] = await Promise.all([
    getProjectsForTicketForm(),
    getAllTickets(),
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
