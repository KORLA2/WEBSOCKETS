import { useParams } from "react-router-dom";
import {useMemo} from "react"
import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../api/api";
import type { ConversationListItem } from "../types/Conversation";
type GetConversationResponse={
    myFriends:ConversationListItem[]
}

const useConversation = () => {
 const {conversationId:receiverId}=useParams();
const isOpen=useMemo(()=>!!receiverId,[receiverId])
const {data,isLoading}=useQuery({queryKey:["conv"],queryFn:async()=>{
   const res=await apiPrivate.get<GetConversationResponse>("/conversations/getall")
   return  res.data;
}});
return useMemo(()=>({
    isOpen,
    myFriends:data?.myFriends,
    receiverId
}),[isOpen,receiverId,data])
}

export default useConversation