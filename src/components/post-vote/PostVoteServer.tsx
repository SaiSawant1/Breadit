import { getAuthSession } from '@/lib/auth'
import { Post, Vote, VoteType } from '@prisma/client'
import React from 'react'

interface PostVoteServerProps{
    postId:string,
    initialVotesAmt?:number,
    initialVote?:VoteType|null,
    getData?:()=>Promise<(Post & {vote:Vote[]})|null>,
}

const PostVoteServer = async ({postId ,initialVotesAmt,initialVote,getData}:PostVoteServerProps) => {
 const session =await getAuthSession()

 let _votes
    return (
    <div>

    </div>
  )
}

export default PostVoteServer