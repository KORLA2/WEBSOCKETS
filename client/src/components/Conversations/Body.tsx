import React from 'react'
import EmptyState from '../Users/EmptyState';
import type { Message } from '../../types/Message';
import MessageBox from './MessageBox';
type ConversationProps={
  conversation:Message[]
}

const Body = ({conversation}:ConversationProps) => {
  if(conversation?.length==0)
  return (
  <div className="flex-1">
    <EmptyState message="Dont Feel Shy‼️ Chat No Problem 😉"/>
  </div>
  )


  return (
    <div className="h-full overflow-y-auto px-6 ">
      {
          conversation?.map((message,i)=>(
              <MessageBox  key={message.id} isLast={i===conversation.length-1} message={message}/>
          ))
      } 
    </div>
  )
}

export default Body