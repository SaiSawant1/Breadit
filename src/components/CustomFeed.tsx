import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";
import { Suspense } from "react";
import Loading from "@/app/loading";

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      subreddit: true,
      author: true,
      votes: true,
      comments: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });
  return (
    <>
      
      <Suspense fallback={<Loading />}>
        {/* @ts-expect-error */}
        <PostFeed initialPosts={posts} />
      </Suspense>
    </>
  );
};
export default CustomFeed;
