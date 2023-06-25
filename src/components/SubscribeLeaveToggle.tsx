"use client";   
import { FC } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios from "axios";

interface SubscribeLeaveToggle{
    subredditId:string
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggle> = ({subredditId}) => {

const {mutate:joinCommunity}=useMutation({
    mutationFn:async()=>{
        const payload:SubscribeToSubredditPayload={
            subredditId
        }
        const {data}=await axios.post("/api/subreddit/subscribe",payload)
        return data as string
    }
})
  const isSubscribed = false;
  return isSubscribed ? (
    <Button  className="w-full mt-1 mb-4 ">Leave community</Button>
  ) : (
    <Button onClick={()=>joinCommunity()} className="w-full mt-1 mb-4 ">Join to post</Button>
  );
};
export default SubscribeLeaveToggle;
