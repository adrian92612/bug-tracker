"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { editUserFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { act, useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editUser } from "@/lib/actions/user-actions";
import { User } from "@prisma/client";
import Link from "next/link";

type rolesType = {
  label: string;
  value: "ADMIN" | "MANAGER" | "DEVELOPER" | "CONTRIBUTOR" | "USER";
};

const roles: rolesType[] = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Manager",
    value: "MANAGER",
  },
  {
    label: "Developer",
    value: "DEVELOPER",
  },
  {
    label: "Contributor",
    value: "CONTRIBUTOR",
  },
  {
    label: "User",
    value: "USER",
  },
];

type EditUserForm = {
  user: User;
};

export const EditUserForm = ({ user }: EditUserForm) => {
  const [state, action, isPending] = useActionState(editUser, {});
  const [resetKey, setResetKey] = useState<number>(0);
  const form = useForm<z.infer<typeof editUserFormSchema>>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      ...(state?.fields ?? {}),
    },
    mode: "onBlur",
  });
  const formRef = useRef<HTMLFormElement>(null);
  console.log(user);
  console.log(state.fields);
  useEffect(() => {
    if (state.success) {
      setResetKey((prev) => prev + 1);
    }
  }, [form, state]);

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader className="text-center relative">
        <CardTitle className="bg-orange-200 text-2xl h-12 inline-flex items-center justify-center rounded-none shadow-sm shadow-slate-800 absolute w-11/12 -top-[30%] left-1/2 translate-x-[-50%]">
          Edit User
        </CardTitle>
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
      </CardHeader>
      <CardContent>
        <Form {...form} key={resetKey}>
          <form
            ref={formRef}
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("on submit form");
              return form.handleSubmit(() => {
                console.log("form submitted");
                action(new FormData(formRef.current!));
              })(e);
            }}
          >
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="hidden"
                        placeholder="Enter your name"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end gap-2">
              <Button type="button" asChild variant="destructive">
                <Link href={`/dashboard/users/${user.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
