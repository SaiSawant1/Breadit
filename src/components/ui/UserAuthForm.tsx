"use client";
import React, { FC } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

import { signIn } from "next-auth/react";
import { Icons } from "./Icon";

const UserAuthForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (err) {
      /* toast error in case of erro*/
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center">
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size="sm"
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="h-5 w-5" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
