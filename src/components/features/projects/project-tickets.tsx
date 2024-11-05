"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

type ProjectTicketCardProps = {
  ticket: Ticket;
};

const ProjectTicketCard = ({ ticket }: ProjectTicketCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticket.title}</CardTitle>
        <CardDescription>{ticket.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-1">
          <Badge>{ticket.status}</Badge>
          <Badge>{ticket.priority}</Badge>
          <Badge>{ticket.type}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

type ProjectTicketsProps = {
  tickets: Ticket[];
};

export const ProjectTickets = ({ tickets }: ProjectTicketsProps) => {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tickets</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {tickets.map((ticket) => (
            <ProjectTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
