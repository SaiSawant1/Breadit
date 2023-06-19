"use client";
import React, { FC } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

import { signIn } from "next-auth/react";
import { Icons } from "./Icon";
import { useToast } from "@/hooks/use-toast";

const UserAuthForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {toast}=useToast()
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
        throw new Error();
      await signIn("google");
      
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not sign in with Google",
        duration: 2000,
        variant:"destructive"
      });
      
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
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
