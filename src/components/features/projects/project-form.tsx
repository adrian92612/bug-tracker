"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { projectFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { upsertProject } from "@/lib/actions/project-actions";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Project } from "@prisma/client";

type ProjectFormProps = {
  ownerId: string;
  project?: Project;
};

export const ProjectForm = ({ ownerId, project }: ProjectFormProps) => {
  const [state, action, isPending] = useActionState(upsertProject, {});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      id: project?.id ?? "",
      ownerId,
      name: project?.name ?? "",
      description: project?.description ?? "",
      deadline: project?.deadline,
      ...(state?.fields ?? {}),
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (state.success && !project) {
      form.reset();
    }
  }, [state.success, form, project]);
  return (
    <Form {...form}>
      {state.success !== undefined && (
        <span
          className={cn(
            state.success ? "text-green-500" : "text-red-500",
            "text-center font-semibold"
          )}
        >
          {state.message}
        </span>
      )}
      <form
        ref={formRef}
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          return form.handleSubmit(() => {
            action(new FormData(formRef.current!));
          })(e);
        }}
      >
        <Input value={form.getValues().ownerId} name="ownerId" type="hidden" />
        <Input value={form.getValues().id} name="id" type="hidden" />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project Name"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Project's description"
                  className="max-h-52 h-52"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="deadline"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal border-border",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Set a deadline</span>
                      )}

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(e) => {
                      field.onChange(e);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                name={field.name}
                value={field.value ? new Date(field.value).toISOString() : ""}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {project && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex"
                  >
                    {projectStatus.map((project) => (
                      <FormItem
                        key={project}
                        className="flex space-x-2 space-y-0 items-center text-sm"
                      >
                        <FormControl>
                          <RadioGroupItem value={project} />
                        </FormControl>
                        <FormLabel className="m-0">{project}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        <Button disabled={isPending}>{project ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
};
