"use client";
import React from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CommentRequest } from "@/lib/validators/comment";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
    postId:string,
    replyToId?:string,
}

const CreateComment:React.FC<CreateCommentProps> = ({postId,replyToId}) => {
  const [input, setInput] = React.useState<string>("");
    const {loginToast}=useCustomToast();

    const router=useRouter()

  const {mutate:postComment,isLoading} = useMutation({
    mutationFn: async ({ text, postId, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        text,
        postId,
        replyToId,
      };
      const { data } = await axios.patch("/api/subreddit/post/comment", payload);
      return data;
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
        router.refresh()
        setInput('')
    }
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Comment</Label>
      <div className="mt-2">
        <Textarea
          rows={1}
          placeholder="What is your comment"
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button isLoading={isLoading} disabled={input.length===0} onClick={()=>postComment({text:input,postId,replyToId})}>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
