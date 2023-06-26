"use client";
import React, { FC } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggle {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggle> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: joinCommunity, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.request?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      React.startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Successfully joined",
        description: `You are now subscribed to this community ${subredditName}`,
        variant: "default",
      });
    },
  });

  //leave a community
  const { mutate: leaveCommunity, isLoading: isLeaveLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.request?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      React.startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Successfully unsubscribed ",
        description: `You are not the member of ${subredditName} community`,
        variant: "default",
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4 "
      onClick={() => leaveCommunity()}
      isLoading={isLeaveLoading}
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => joinCommunity()}
      className="w-full mt-1 mb-4 "
    >
      Join to post
    </Button>
  );
};
export default SubscribeLeaveToggle;
