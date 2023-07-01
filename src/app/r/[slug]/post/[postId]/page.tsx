import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { notFound } from "next/navigation"
import {FC} from "react"

interface PageProps{
    params:{
        postId:string
    }
}

export const dynamic = "force-dynamic"

export const fetchCache="force-no-store"

const page= async({params}:PageProps)=>{
    
    const cachedPost=(await redis.hgetall(`post:${params.postId}`))as CachedPost

    let post:( Post&{vote:Vote[];author:User})|null=null

    if(!cachedPost){
        post=await db.post.findFirst({
            where:{
                id:params.postId
            },
            include:{
                author:true,
                votes:true,
            }
        })
    }


    if(!post && !cachedPost){
        return notFound()
    }

    }

    return(
        <div>
            <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
                
            </div>
        </div>
    )
}

export default page
