"use client";

import { Button } from "@/components/ui/button";
import { oAuthLogin } from "@/lib/actions/actions";
import { FaGithub, FaGoogle } from "react-icons/fa";

export const OAuthForm = () => {
  return (
    <form action={oAuthLogin} className="grid gap-4">
      <Button variant="outline" size="lg" name="action" value="google">
        <FaGoogle />
        Login With Google
      </Button>
      <Button variant="outline" size="lg" name="action" value="github">
        <FaGithub />
        Login With GitHub
      </Button>
    </form>
  );
};
