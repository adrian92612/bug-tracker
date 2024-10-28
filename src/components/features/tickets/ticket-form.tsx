"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/lib/actions/ticket-actions";
import { ticketFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project, Ticket } from "@prisma/client";
import { useActionState, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TicketFormProps = {
  projects: Project[];
  ticket?: Ticket;
};

const ticketTypes = ["BUG", "TASK", "OTHERS"];
const ticketPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const TicketForm = ({ projects, ticket }: TicketFormProps) => {
  const [state, action, isPending] = useActionState(upsertTicket, {});
  const [resetKey, setResetKey] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      id: ticket?.id ?? "",
      projectId: ticket?.projectId ?? "",
      title: ticket?.title ?? "",
      description: ticket?.description ?? "",
      priority: ticket?.priority ?? "MEDIUM",
      type: ticket?.type ?? "BUG",
    },
  });
  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          return form.handleSubmit(() => {
            action(new FormData(formRef.current!));
          })(e);
        }}
        key={resetKey}
      >
        {state.success !== undefined && (
          <span
            className={cn(
              state.success ? "text-green-700" : "text-red-700",
              "text-center font-semibold"
            )}
          >
            {state.message}
          </span>
        )}

        {ticket && (
          <Input type="hidden" name="id" value={form.getValues().id} />
        )}

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Ticket Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write the ticket's description here"
                  className="max-h-52 h-52"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Ticket Type</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex"
                >
                  {ticketTypes.map((ticket) => (
                    <FormItem
                      key={ticket}
                      className="flex space-x-2 space-y-0 items-center text-sm"
                    >
                      <FormControl>
                        <RadioGroupItem value={ticket} />
                      </FormControl>
                      <FormLabel className="m-0">{ticket}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Priority Level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex"
                >
                  {ticketPriorities.map((ticket) => (
                    <FormItem
                      key={ticket}
                      className="flex space-x-2 space-y-0 items-center text-sm"
                    >
                      <FormControl>
                        <RadioGroupItem value={ticket} />
                      </FormControl>
                      <FormLabel className="m-0">{ticket}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>Submit</Button>
      </form>
    </Form>
  );
};