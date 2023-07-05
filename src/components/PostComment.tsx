"use client";
import React from "react";
import UserAvatar from "./ui/UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}
const PostComment: React.FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId,
}) => {

 /* all the state*/
  const commentRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setisReplying] = React.useState<boolean>(false);
  const [input,setInput]=React.useState<string>("")
  const {loginToast}=useCustomToast();
  /*post reply*/

  const {mutate:postComment,isLoading}=useMutation({
    mutationFn: async ({postId,replyToId,text}:CommentRequest) => {
      const payload:CommentRequest={
        postId,
        text,
        replyToId
      }
      const {data}=await axios.patch('/api/subreddit/post/comment',payload)
      return data;
    },
    onSuccess:()=>{
      setisReplying(false);
      router.refresh();

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
  }

  })


  return (
    <div
      className="flex flex-col p-2 border-zinc-400 border-2 rounded-3xl"
      ref={commentRef}
    >
      <div className="flex items-center">
        <UserAvatar
          className="h-6 w-6"
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
        />
        <div className="ml-2 flex items-center  gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500 ">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2 ">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVote={currentVote}
          initialVotedAmt={votesAmt}
        />
        <Button
          onClick={() => {
            if (!session) return router.push("/login");
            else {
              setisReplying(true);
            }
          }}
          variant="ghost"
          size="xs"
          aria-label="reply"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" /> Reply
        </Button>
        {isReplying && (
          <div className="gird w-full gap-1.5 ">
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
                  <Button variant="subtle" tabIndex={-1} 
                  onClick={()=>setisReplying(false)} >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isLoading}
                    disabled={input.length === 0}
                    onClick={() =>
                      postComment({ text: input, postId, replyToId:comment.replyToId??comment.id})
                    }
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
