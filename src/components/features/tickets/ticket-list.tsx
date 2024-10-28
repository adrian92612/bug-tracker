"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project, Ticket } from "@prisma/client";
import { MoreActionsDropdown } from "../more-actions";
import { TicketForm } from "./ticket-form";

type ticketCardProps = {
  ticket: Ticket;
  projects: Project[];
};

const TicketCard = ({ ticket, projects }: ticketCardProps) => {
  function deleteticket(id: string): Promise<boolean> {
    throw new Error("Function not implemented.");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="ongoing">{ticket.status.toLowerCase()}</Badge>
          <MoreActionsDropdown
            id={ticket.id}
            name={ticket.title}
            pageHref={`/dashboard/tickets/${ticket.id}`}
            deleteFn={deleteticket}
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

type TicketListProps = {
  tickets: Ticket[];
  projects: Project[];
};

const TicketList = ({ tickets, projects }: TicketListProps) => {
  return (
    <section>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <TicketCard ticket={ticket} projects={projects} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TicketList;
