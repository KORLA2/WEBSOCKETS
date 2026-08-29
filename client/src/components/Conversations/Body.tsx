import React, { useEffect, useRef } from 'react'
import EmptyState from '../Users/EmptyState';
import type { Message } from '../../types/Message';
import MessageBox from './MessageBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../../api/api';
import useConversation from '../../hooks/useConversation';
import axios from 'axios';
type ConversationProps={
  conversation:(Message&{
    sendername: string,
    seenby: string[]
  })[]
}

const Body = ({conversation}:ConversationProps) => {

 const {conversationId}=useConversation();
 const bottomRef=useRef<HTMLDivElement>(null) 
const queryClient=useQueryClient();
 const mutation= useMutation({mutationFn:async()=>{
    const res= await apiPrivate.post(`/messages/seen/`,{
      cid:conversationId
    });
     console.log(res)
    return res.data;
  },
 onSuccess:(data)=>{
  console.log(data)
 console.log("Successfully inserted");
    queryClient.setQueryData(['conv'],(old)=>{

      return {
               myFriends:old.myFriends.map(friend=>{
                  if(friend.id==conversationId){
                     return {
                        ...friend,
                        lastMessage:{...friend.lastMessage,isSeenByMe:true}
                     }
                  }
                  return friend;
               })
            }

      })
  
 },
 onError:(err)=>{
  if(axios.isAxiosError(err))
 console.log(err.response?.data,"Failed Insertign")

 }

})

useEffect(()=>{

  if(!conversationId) return ;
  bottomRef.current?.scrollIntoView();
mutation.mutate()
},[conversationId,conversation.length])

  if(conversation?.length==0)
  return (
  <div className="flex-1">
    <EmptyState message="Dont Feel Shy‼️ Chat No Problem 😉"/>
  </div>
  )

  return (
    <div className="h-full overflow-y-auto px-6 relative flex-1  ">
      {
        conversation?.map((message,i)=>(
          <MessageBox key={message.id} isLast={i===conversation.length-1} message={message}/>
        ))
      } 
      <div ref={bottomRef} className="pt-2"/>
    </div>
  )
}

export default Body
