"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createProjectSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createProject } from "@/lib/actions/project-actions";
import { Textarea } from "@/components/ui/textarea";

type ProjectFormProps = {
  ownerId: string;
};

export const ProjectForm = ({ ownerId }: ProjectFormProps) => {
  const [state, action, isPending] = useActionState(createProject, {});
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      ownerId,
      name: "",
      description: "",
      ...(state?.fields ?? {}),
    },
    mode: "onBlur",
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      form.reset();
    }
  }, [state.success, form]);

  return (
    // <Card className="w-full border-none shadow-none">
    //   <CardHeader className="text-center relative">
    //     <CardTitle>New Project</CardTitle>
    //     {state.success !== undefined && (
    //       <span
    //         className={cn(
    //           state.success ? "text-green-700" : "text-red-700",
    //           "text-center font-semibold"
    //         )}
    //       >
    //         {state.message}
    //       </span>
    //     )}
    //   </CardHeader>
    //   <CardContent>
    <Form {...form}>
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

        <Button disabled={isPending}>Create</Button>
      </form>
    </Form>
    //   </CardContent>
    // </Card>
  );
};
