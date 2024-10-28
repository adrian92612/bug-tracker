import { FormDialog } from "@/components/features/form-dialog";
import { TicketForm } from "@/components/features/tickets/ticket-form";
import TicketList from "@/components/features/tickets/ticket-list";
import {
  getAllTickets,
  getProjectsForTicketForm,
} from "@/lib/actions/ticket-actions";

const TicketsPage = async () => {
  const projects = await getProjectsForTicketForm();
  const tickets = await getAllTickets();
  return (
    <div>
      TicketsPage
      <FormDialog buttonLabel="Create a Ticket" formTitle="New Ticket">
        <TicketForm projects={projects} />
      </FormDialog>
      <TicketList tickets={tickets} projects={projects} />
    </div>
  );
};

export default TicketsPage;
