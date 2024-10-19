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
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email address"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button>Login</Button>
          </form>
        </Form>
      </CardContent>

      <div className="flex items-center gap-5 p-6 pt-0">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>

      <CardContent>
        <div className="grid gap-4">
          <Button variant="outline">
            <FaGoogle />
            Login With Google
          </Button>
          <Button variant="outline">
            <FaGithub />
            Login With GitHub
          </Button>
        </div>
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
