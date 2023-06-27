import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req:Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await req.json();
        const {subredditId,title,content}=PostValidator.parse(body)
        const subscriptionExists=await db.subscription.findFirst({
            where:{
                subredditId,
                userId:session.user.id
            }
        })
        if(!subscriptionExists){
            return new Response("You are not a part of the community ", { status: 400 })
        }
        await db.post.create({
            data:{
                title,
                content,
                subredditId,
                authorID:session.user.id,

            }
        })
        return new Response("post created", { status: 200 });
    } catch (err) {
        if(err){
            if(err instanceof z.ZodError){
                return new Response(err.message, {status:422})
            }  
        }
        return new Response("Could not post. Please try again later", {status:500})
    }
}