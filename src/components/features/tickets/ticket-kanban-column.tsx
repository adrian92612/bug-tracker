import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KanbanTicket, TicketColumn } from "./ticket-kanban";
import TicketCard from "./ticket-card";
import { Project } from "@prisma/client";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

type TicketColumnProps = {
  column: TicketColumn;
  projects: Project[];
  tickets: KanbanTicket[];
  isActive: boolean;
};

export const TicketKanbanColumn = ({
  column,
  projects,
  tickets,
  isActive,
}: TicketColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        isActive && "ring-2 ring-green-500",
        "flex flex-col h-[80dvh] min-w-72 overflow-x-hidden rounded-none"
      )}
    >
      <CardHeader>
        <CardTitle>{column.id}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-2">
        <ul className="flex flex-col gap-2  ">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket.data.ticket}
              projects={projects}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
