"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { loginFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { OAuthForm } from "./oauth-form";
import { useActionState, useEffect, useRef } from "react";
import { credentialsLogin } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [state, action, isPending] = useActionState(credentialsLogin, {});
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(state?.fields ?? {}),
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.push("/dashboard/overview");
  }, [router, state.success]);

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader>
        <CardTitle className="sr-only">Login</CardTitle>
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
              name="email"
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

            <Button disabled={isPending}>Login</Button>
          </form>
        </Form>
      </CardContent>

      <div className="flex items-center gap-5 p-6 pt-0">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>

      <CardContent>
        <OAuthForm />
      </CardContent>

      <div className="flex items-center gap-5 p-6 pt-0">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>

      <CardContent className="text-center">
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-blue-700"
        >
          Don&apos;t have an account? Register here
        </Link>
      </CardContent>
    </Card>
  );
};
