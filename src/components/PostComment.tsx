"use client";
import React from "react";
import UserAvatar from "./ui/UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
}
const PostComment: React.FC<PostCommentProps> = ({ comment }) => {
  const commentRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col " ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          className="h-6 w-6"
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
        />
        <div className="ml-2 flex items-center gap-x-2">
            <p className="text-sm font-medium text-gray-900">u/{comment.author.username}</p>
        </div>
        <p className="max-h-40 truncate text-xs text-zinc-500 ">
          {formatTimeToNow(new Date(comment.createdAt))}
        </p>
      </div>
    </div>
  );
};

export default PostComment;
