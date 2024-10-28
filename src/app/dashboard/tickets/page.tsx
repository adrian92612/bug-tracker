import { FormDialog } from "@/components/features/form-dialog";
import { TicketForm } from "@/components/features/tickets/ticket-form";
import { getProjectsForTicketForm } from "@/lib/actions/ticket-actions";

const TicketsPage = async () => {
  const projects = await getProjectsForTicketForm();
  return (
    <div>
      TicketsPage
      <FormDialog buttonLabel="Create a Ticket" formTitle="New Ticket">
        <TicketForm projects={projects} />
      </FormDialog>
    </div>
  );
};

export default TicketsPage;
