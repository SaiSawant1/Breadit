import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { PostVoteValidator } from "@/lib/validators/votes";
import { CachedPost } from "@/types/redis";
import { VoteType } from "@prisma/client";
import { z } from "zod";

const CACHE_AFTER_UPVOTES=1;

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { postId, vote } = PostVoteValidator.parse(body);
    const { subredditId, title, content } = PostValidator.parse(body);
    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });
    if (!post) {
      return new Response("Post was not found", { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === vote) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK");
      }
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: vote,
        },
      });
      //caching
      const votesAmt=post.votes.reduce((acc,vote)=>{
        if(vote.type=="UP")return acc + 1
        if(vote.type=="DOWN") return acc - 1
        return acc
      },0)
      if(votesAmt>=CACHE_AFTER_UPVOTES){
        const cachePayload:CachedPost={
            authorUsername:post.author.username??"",
            title:post.title,
            content:JSON.stringify(post.content),
            id:post.id,
            currentVotes:vote,
            createdAt:post.createdAt
        }
      }
      
    }

    return new Response("post created", { status: 200 });
  } catch (err) {
    if (err) {
      if (err instanceof z.ZodError) {
        return new Response(err.message, { status: 422 });
      }
    }
    return new Response("Could not post. Please try again later", {
      status: 500,
    });
  }
}
