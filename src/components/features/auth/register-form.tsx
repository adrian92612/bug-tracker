"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { registerFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { registerUser } from "@/lib/actions/actions";
import { cn } from "@/lib/utils";

export const RegisterForm = () => {
  const [state, action, isPending] = useActionState(registerUser, {});
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...(state?.fields ?? {}),
    },
    mode: "onBlur",
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      form.reset();
    }
  }, [form, state.success]);

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader>
        <CardTitle className="sr-only">Register</CardTitle>
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
          >
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

      <div className="flex items-center gap-5 p-6 pt-0">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>

      <CardContent className="text-center">
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-blue-700"
        >
          Already have an account? Login here
        </Link>
      </CardContent>
    </Card>
  );
};
