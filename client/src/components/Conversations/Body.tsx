import React, { useEffect, useRef } from 'react'
import EmptyState from '../Users/EmptyState';
import type { Message } from '../../types/Message';
import MessageBox from './MessageBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../../api/api';
import useConversation from '../../hooks/useConversation';
import axios from 'axios';
import { useCurrentConversation } from './CurrentConversationContext';
import { useMessages } from '../../hooks/useMessages';
type ConversationProps={
  conversation:(Message&{
    sendername: string,
    seenby: string[]
  })[]
}

const Body = ({id}:{id:string}) => {

 const {conversationId}=useConversation();
 const bottomRef=useRef<HTMLDivElement>(null);
 const {data,isError,isLoading}=useMessages(id)

 const {messages,readStates}=data;
 console.log(messages,readStates)
const seenMsgId=messages.findLast(message=>message.isMine)?.id
 const {currentConversation}=useCurrentConversation();
 const previousLengthRef = useRef(0);
 const {isgroup}=currentConversation??{};
const queryClient=useQueryClient();
 const mutation= useMutation({mutationFn:async()=>{
    const res= await apiPrivate.patch(`/conversations/seen/`,{
      cid:conversationId
    });
    return res.data;
  },
  onSuccess:(data)=>{

    
  },
  onError:(err)=>{
    if(axios.isAxiosError(err))
  console.log(err.response?.data,"Failed Insertign")

  }

})

useEffect(()=>{

  if(!conversationId|| messages.length==0) return ;

  const previousLength = previousLengthRef.current;
  // Only scroll when number of messages increased
  if (messages.length > previousLength) {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }
  previousLengthRef.current = messages.length;

 const lastMessage=messages.at(-1);
  if(!lastMessage.isMine)
  mutation.mutate();
},[conversationId,messages.length])

  if(messages?.length==0)
  return (
  <div className="flex-1">
    <EmptyState message="Dont Feel Shy‼️ Chat No Problem 😉"/>
  </div>
  )

  return (
    <div className="h-full overflow-y-auto px-6 relative flex-1  ">
      {
        messages?.map((message,i)=>(
          <MessageBox key={message.id} readStates={readStates} isgroup={isgroup} showSeen={seenMsgId==message.id} message={message}/>
        ))
      } 
      <div ref={bottomRef} className="pt-2"/>
    </div>
  )
}

export default Body
