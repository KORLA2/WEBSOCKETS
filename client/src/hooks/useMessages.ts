import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../api/api";

  
  const fetchConversation=async(id:string | undefined)=>{
    const res=await apiPrivate.get(`/conversations/${id}/messages`);
    return res.data;
  }
export const useMessages=(id)=>{


 return  useQuery({
    queryKey:["conversation",id],
    queryFn:()=>fetchConversation(id),
    enabled:!!id,
  });

}