import axios from 'axios';
import {Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
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
type ConversationData = {
  messages: Message[];
};
const App = () => {
   const queryClient=useQueryClient();
  const dispatch=useDispatch<AppDispatch>();
  const navigate= useNavigate();
  const {data:user,isLoading}=useQuery({queryKey:["getme"],queryFn: async()=>{
      const res=await apiPrivate.get("/auth/getme");
       if(!res.data.user){
         navigate("/auth")
       }
      dispatch(setUser(
         res.data.user
      )) 
      return res.data
   },

  
}
)
useEffect(()=>{

   if(!user)return;
   const ws=new WebSocket("ws://localhost:4000");
   ws.onopen=()=>{
      console.log("WebSocket Connected");
   }
   ws.onmessage=(event)=>{
      const data:{message:Message,event:string}=JSON.parse(event.data);
       switch(data.event){
           case "seen": 
            console.log("event seen",data)
                  queryClient.setQueryData<ConversationData>(["conversation",data.cid.id],(old)=>{
               if(!old) return;
               return{
                  ...old,
                  messages:[...old.messages].map((message)=>{
                     if(data.messageIds.includes(message.id)){
                        const alreadySeen=message.seenby.some(name=>name==data.seenBy);

                        if(alreadySeen) return message;
                        return {
                           ...message,
                           seenby:[...message.seenby,data.seenBy]
                        }
                     }
                     else return message
                  })
               }
               
              })
            
           break ;

          case "send":{
                  console.log("EVENT SENT",data);

             queryClient.setQueryData<ConversationData>(["conversation",data.message.cid],
               (old)=>{if(!old)return ;
            return {
              ...old,
               messages:[
                  ...old.messages,
                  data.message,
               ]
            }
         })

            const cid=data.message.cid;
         queryClient.setQueryData(['conv'],(old)=>{
            if(!old)return ;
            return {
               myFriends:old.myFriends.map(friend=>{
                  if(friend.id==cid){
                     return {
                        ...friend,
                        lastMessage:{...data.message}
                     }
                  }
                  return friend;
               })
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
