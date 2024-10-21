"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { addUserFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUser } from "@/lib/actions/user-actions";

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

export const AddUserForm = () => {
  const [state, action, isPending] = useActionState(addUser, {});
  const [resetKey, setResetKey] = useState<number>(0);
  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      role: undefined,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...(state?.fields ?? {}),
    },
    mode: "onSubmit",
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      form.reset();
      setResetKey((prev) => prev + 1);
    }
  }, [form, state]);
  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader className="text-center relative">
        <CardTitle className="bg-amber-300 text-slate-800 text-2xl h-12 inline-flex items-center justify-center rounded-none shadow-sm shadow-slate-800 absolute w-11/12 -top-[30%] left-1/2 translate-x-[-50%]">
          Add New User
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
              return form.handleSubmit(() => {
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

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email address"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending}>Register</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
