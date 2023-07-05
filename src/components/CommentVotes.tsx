"use client";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import React from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CommentVoteRequest, PostVoteRequest } from "@/lib/validators/votes";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/Button";



interface CommentVoteProps {
  commentId: string;
  initialVotedAmt: number;
  initialVote?: Pick<CommentVote, "type">;
}

const CommentVotes: React.FC<CommentVoteProps> = ({
  commentId,
  initialVotedAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = React.useState<number>(initialVotedAmt);
  const [currentVote, setCurrentVote] = React.useState(initialVote);
  const prevVote = usePrevious(currentVote);


  const { mutate: addUserVote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        vote: type,
      };
      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onError: (err, type) => {
      if (type === "UP") {
        setVotesAmt((prev) => prev - 1);
      }
      if (type === "DOWN") {
        setVotesAmt((prev) => prev - 1);
      }

      setCurrentVote(prevVote);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") {
          setVotesAmt((prev) => prev - 1);
        } else if (type === "DOWN") {
          setVotesAmt((prev) => prev + 1);
        }
      } else {
        setCurrentVote({type});
        if (type === "UP") {
          return setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        } else if (type === "DOWN") {
          return setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => addUserVote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>
      <Button
        onClick={() => addUserVote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
