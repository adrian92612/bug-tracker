import { ForbiddenPage } from "@/components/features/forbidden";
import { getTicket, getTicketMembers } from "@/lib/actions/ticket-actions";
import { getSessionInfo } from "@/lib/actions/user-actions";

type TicketDetailsPageProps = {
  params: {
    id: string;
  };
};

const TicketDetailsPage = async ({ params }: TicketDetailsPageProps) => {
  const [ticket, ticketMembers] = await Promise.all([
    getTicket(params.id),
    getTicketMembers(params.id),
  ]);
  if (!ticket) return <div>No Ticket Found</div>;

  const { userId } = await getSessionInfo();
  const isInTicket =
    ticket.assignedToId === userId ||
    ticket.createdById === userId ||
    ticketMembers.some((member) => member.id === userId);

  if (!isInTicket) return <ForbiddenPage />;

  return (
    <div>
      TicketDetailsPage
      <div>{userId}</div>
      <div>{JSON.stringify(ticket)}</div>
      {JSON.stringify(ticketMembers)}
    </div>
  );
};

export default TicketDetailsPage;
