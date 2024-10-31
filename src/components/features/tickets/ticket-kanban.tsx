"use client";

import { Project, Ticket } from "@prisma/client";
import { useEffect, useState } from "react";
import { TicketKanbanColumn } from "./ticket-kanban-column";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import TicketCard from "./ticket-card";
import { updateTicketStatus } from "@/lib/actions/ticket-actions";
import dynamic from "next/dynamic";
const DragOverlayWrapper = dynamic(
  () =>
    Promise.resolve(({ children }: { children: React.ReactNode }) =>
      createPortal(children, document.body)
    ),
  { ssr: false }
);

type TicketListProps = {
  tickets: Ticket[];
  projects: Project[];
};

export type TicketColumn = {
  id: "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
};

export type KanbanTicket = {
  id: string;
  columnId: "OPEN" | "IN_PROGRESS" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  data: {
    ticket: Ticket;
  };
};

const ticketColumns: TicketColumn[] = [
  {
    id: "OPEN",
  },
  {
    id: "IN_PROGRESS",
  },
  {
    id: "RESOLVED",
  },
  {
    id: "IN_REVIEW",
  },
  {
    id: "CLOSED",
  },
];

const setInitialTickets = (tickets: Ticket[]): KanbanTicket[] => {
  return tickets.map((ticket) => ({
    id: ticket.id,
    columnId: ticket.status,
    data: { ticket },
  }));
};

const TicketKanban = ({ tickets, projects }: TicketListProps) => {
  const [kanbanTickets, setKanbanTickets] = useState<KanbanTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<KanbanTicket | null>(null);
  const [activeColumn, setActiveColumn] = useState<TicketColumn["id"] | null>(
    null
  );

  const getColumnTickets = (id: KanbanTicket["columnId"]): KanbanTicket[] => {
    return kanbanTickets.filter((ticket) => ticket.columnId === id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const activeTicket = kanbanTickets.find(
      (ticket) => ticket.id === active.id
    );
    if (activeTicket) {
      setActiveTicket(activeTicket);
    }
  };
  const handleDragOver = async (e: DragOverEvent) => {
    const { over } = e;
    if (over) {
      setActiveColumn(over.id as TicketColumn["id"]);
    } else {
      setActiveColumn(null);
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || !activeTicket) return;

    const overId = over.id as KanbanTicket["columnId"];

    if (activeTicket.columnId === overId) {
      setActiveTicket(null);
      setActiveColumn(null);
      return;
    }

    // Immediately update the state
    setKanbanTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === active.id ? { ...ticket, columnId: overId } : ticket
      )
    );

    // Update the activeTicket state
    setActiveTicket((prev) => (prev ? { ...prev, columnId: overId } : null));
    try {
      await updateTicketStatus({
        id: activeTicket.id,
        status: overId,
      });
    } catch (error) {
      console.error("Failed to update ticket status: ", error);
      // Revert the change in case of an error
      setKanbanTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === active.id
            ? { ...ticket, columnId: activeTicket.columnId }
            : ticket
        )
      );
    }

    setActiveTicket(null);
    setActiveColumn(null);
  };

  useEffect(() => {
    setKanbanTickets(setInitialTickets(tickets));
  }, [tickets]);

  return (
    <section className="px-3">
      <div className="flex gap-5 overflow-x-auto py-5">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {ticketColumns.map((col) => (
            <TicketKanbanColumn
              key={col.id}
              column={col}
              projects={projects}
              tickets={getColumnTickets(col.id)}
              isActive={activeColumn === col.id}
            />
          ))}
          <DragOverlayWrapper>
            <DragOverlay>
              {activeTicket && (
                <div className="opacity-80">
                  <TicketCard ticket={activeTicket.data.ticket} projects={[]} />
                </div>
              )}
            </DragOverlay>
          </DragOverlayWrapper>
        </DndContext>
      </div>
    </section>
  );
};

export default TicketKanban;
