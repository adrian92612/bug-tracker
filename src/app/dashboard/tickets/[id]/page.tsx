import { getTicket, getTicketMembers } from "@/lib/actions/ticket-actions";
import { getUserId } from "@/lib/actions/user-actions";

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
  const id = await getUserId();

  console.log(id, ticket, ticketMembers);

  return (
    <div>
      TicketDetailsPage
      <div>{id}</div>
      <div>{JSON.stringify(ticket)}</div>
      {JSON.stringify(ticketMembers)}
    </div>
  );
};

export default TicketDetailsPage;
