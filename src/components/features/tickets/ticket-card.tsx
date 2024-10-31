import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreActionsDropdown } from "../more-actions";
import { deleteTicket } from "@/lib/actions/ticket-actions";
import { TicketForm } from "./ticket-form";
import { Project, Ticket } from "@prisma/client";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

type TicketCardProps = {
  ticket: Ticket;
  projects: Project[];
};

const TicketCard = ({ ticket, projects }: TicketCardProps) => {
  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useDraggable({
      id: ticket.id,
      data: ticket,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <div className="border-rose-500 border-2 rounded-sm h-52"></div>;
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab h-52"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="ongoing">{ticket.status.toLowerCase()}</Badge>
          <MoreActionsDropdown
            id={ticket.id}
            name={ticket.title}
            pageHref={`/dashboard/tickets/${ticket.id}`}
            deleteFn={deleteTicket}
            editForm={<TicketForm ticket={ticket} projects={projects} />}
          />
        </div>
        <CardTitle className="text-xl">{ticket.title}</CardTitle>
        <CardDescription>{ticket.description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default TicketCard;
