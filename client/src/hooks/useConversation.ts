import { useParams } from "react-router-dom";
import {useMemo} from "react"
import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../api/api";
import type { ConversationListItem } from "../types/Conversation";
export type GetConversationResponse={
    myFriends:ConversationListItem[]
}

const useConversation = () => {
 const {conversationId}=useParams();
const isOpen=useMemo(()=>!!conversationId,[conversationId])
const {data,isLoading,isError}=useQuery({queryKey:["conv"],queryFn:async()=>{
   const res=await apiPrivate.get<GetConversationResponse>("/conversations/getall")
   return  res.data;
}});

return {
    isOpen,
    isLoading,
    ...data,
    conversationId,
    isError
}
}

export default useConversation