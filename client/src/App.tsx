import axios from 'axios';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import Auth from './components/Auth/Auth';
import api, { apiPrivate } from './api/api';
import { setUser } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import Page from './components/Users/Page';
import GuestRoute from './Routes/GuestRoute';
import PrivateRoute from './Routes/PrivateRoute';
import type { AppDispatch } from '../store/store';
import Conversation from './components/Conversations/Conversation';
import type { Message } from './types/Message';
import type { GetConversationResponse } from './hooks/useConversation';
import type { ConversationListItem } from './types/Conversation';
import { useGetMe } from './hooks/useGetMe';
type ConversationData = {
  messages: Message[];
};
const App = () => {
   const queryClient=useQueryClient();
  const dispatch=useDispatch<AppDispatch>();
  const navigate= useNavigate();
  const {data:user,isLoading}=useGetMe()
useEffect(()=>{

   if(!user)return;
   const ws=new WebSocket("ws://localhost:4000");
   ws.onopen=()=>{
      console.log("WebSocket Connected");
   }
   ws.onmessage=(event)=>{
      const data:{message:Message,event:string}=JSON.parse(event.data);
       switch(data.event){
           case "seen": {
               if (!data.cid || !data.readState) {
                     console.error("Invalid seen event payload:", data);
                     break;
                  }
                  else{
                     console.log("Correct Payload",data)
                  }
              queryClient.setQueryData(['conversation',data.cid],(old)=>{
                  if(!old) return ;
                  return {
                     ...old,
                     readStates:
                     old.readStates
                     .map(readState=>readState.userId==data.readState.userId?{...readState,lastReadAt:data.readState.lastReadAt} 
                        :readState   )
                  }
                 })

                 queryClient.setQueryData(["conv"],(old)=>{

                        if(!old)return ;

                        return{

                           myconversations:old.myconversations.map((conv)=>(conv.id==data.cid?{...conv,
                                 lastReadAt:data.readState.lastReadAt,
                                 unreadCount:0,
                              }:conv))
                        }

                 })

           
              }
              

               
           break ;

          case "send":{
                  console.log("EVENT SENT",data);

             queryClient.setQueryData<ConversationData>(["conversation",data.message.conversationId],
               (old)=>{if(!old)return ;
            return {
              ...old,
               messages:[
                  ...old.messages,
                  data.message,
               ]
            }
         })

            const cid=data.message.conversationId;
         queryClient.setQueryData(['conv'],(old)=>{
            if(!old)return ;
            return {
               myconversations:old.myconversations.map(conversation=>{
                  if(conversation.id==cid){
                     return {
                        ...conversation,
                        lastMessage:{...data.message},
                        unreadCount:+conversation.unreadCount+1,
                     }
                  }
                  return conversation;
               }) .sort((a, b) => {
                  const aTime = a.lastMessage?.createdAt
                     ? new Date(a.lastMessage.createdAt).getTime()
                     : 0;

                  const bTime = b.lastMessage?.createdAt
                     ? new Date(b.lastMessage.createdAt).getTime()
                     : 0;

                  return bTime - aTime;
                }),
            }
         })


          }

        
       }  

   }

 
return ()=>{
 ws.close()
}

},[user])


if(isLoading) return <p>App Loading....</p>
   return <div className="h-screen">
<Routes>

<Route path="/" element={<Navigate to="/auth"/>}/>

<Route element={<GuestRoute />}>
  <Route path="/auth" element={<Auth/>} />
</Route>
<Route element={<PrivateRoute  />}>
  <Route path="/users" element={<Page/>} />
  <Route path="/conversations/:conversationId?" element={<Page/>} />
</Route>
   <Route path='*' element={<div>404 path not found</div>}/>
</Routes>
   
   </div>

  
}

export default App
