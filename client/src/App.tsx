import axios from 'axios';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {useEffect, useRef, useState} from 'react';
import Auth from './components/Auth/Auth';
import api, { apiPrivate } from './api/api';
import { setUser } from '../store/slices/authSlice';
import { Provider, useDispatch } from 'react-redux';
import Page from './components/Users/Page';
import GuestRoute from './Routes/GuestRoute';
import PrivateRoute from './Routes/PrivateRoute';
import type { AppDispatch } from '../store/store';
import Conversation from './components/Conversations/Conversation';
import type { Message } from './types/Message';
import type { GetConversationResponse } from './hooks/useConversation';
import type { ConversationListItem } from './types/Conversation';
import { useGetMe } from './hooks/useGetMe';
import store from '../store/store';
import { setWebSocket } from '../store/slices/wsSlice';
import { WebSocketContextProvider } from './helpers/contexts/WebSocketContext';
type ConversationData = {
  messages: Message[];
};


const changeReactionCount=(reactions,emoji,amount)=>{
   let existingReaction=reactions.find(reaction=>reaction.emoji==emoji);

    if(!existingReaction&&amount>0){
      return [
         ...reactions,
         {
            count:1,
            reactedByMe:false,
            emoji
         }
      ]
    }
   else if(!existingReaction){
   return reactions;
   }


   const updatedCount=existingReaction.count+amount; 
   if(updatedCount==0){
      return reactions.filter(reaction=>reaction.emoji!==emoji)
   }
  return  reactions.map(reaction=>reaction.emoji==emoji?{
   ...reaction,
   count:updatedCount
  }:reaction)

}


const App = () => {
   const queryClient=useQueryClient();
   const wsRef=useRef<WebSocket|null>(null);
   const {data:user,isLoading}=useGetMe();
   const dispatch=useDispatch();
useEffect(()=>{

   if(!user)return;
    const ws=new WebSocket("ws://localhost:4000");
    wsRef.current=ws;
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
          break;
        case "reaction":{
            queryClient.setQueryData(["conversation",data.cid],(old)=>{
                if(!old) return ;
                return {
                  ...old,
                  messages:old.messages.map(message=>{

                        if(message.id!==data.reaction.mid) return message;
                        let reactions=message.reactions??[];

                           if(data.reaction.action=="added"){
                              reactions=changeReactionCount(
                                 reactions,
                                 data.reaction.newEmoji,
                                 1
                              );
                           }
                           else if(data.reaction.action=="changed"){
                                 reactions=changeReactionCount(reactions,data.reaction.oldEmoji,-1);
                                 reactions=changeReactionCount(reactions,data.reaction.newEmoji,1);

                           }

                           else if(data.reaction.action=="removed"){
                              reactions=changeReactionCount(reactions,data.reaction.oldEmoji,-1);
                           }

                         if(data.reaction.uid==user.userId){
                           reactions=reactions.map(reaction=>({
                              ...reaction,
                                 reactedByMe:data.reaction.action!=='removed'&&data.reaction.newEmoji==reaction.emoji 
                           }))
                         }

                           return {
                              ...message,
                              reactions,
                           }

                  })
                }
            })
        }
        break;

        case 'typing:start':{
         console.log("Typing")
           queryClient.setQueryData(["conv"],(old)=>{
               if(!old) return;
               return {
                 myconversations:old.myconversations.map((conv)=>conv.id==data.cid?
                 {...conv,
                  Typing:{
                     userid:data.userId,
                     image:data.image,
                  } 
                 }
                 :conv)
               }
           })
        }
        break;
        case 'typing:stop':{
         queryClient.invalidateQueries({queryKey:["conv"]})
        }
       }  

   }

 
return ()=>{
 ws.close();
 wsRef.current=null;
}

},[user])


if(isLoading) return <p>App Loading....</p>
   return <WebSocketContextProvider value={{wsRef}}>
 <div className="h-screen">
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
   </WebSocketContextProvider>

  
}

export default App
