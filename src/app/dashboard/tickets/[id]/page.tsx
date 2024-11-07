import { getTicket, getTicketMembers } from "@/lib/actions/ticket-actions";

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

  console.log(ticket, ticketMembers);

  return <div>TicketDetailsPage</div>;
};

export default TicketDetailsPage;
