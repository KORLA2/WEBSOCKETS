import React from 'react'
import Avatar from '../Avatar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import type { Conversation, ConversationListItem } from '../../types/Conversation';
import GroupAvatar from './GroupAvatar';

type ConversationProps={
    data:ConversationListItem,
    selected:boolean
    id:string,
    
}
const ConversationBox = ({
  data:{avatar,title,lastMessage,type,members},
  selected,id}:ConversationProps) => {
    const navigate=useNavigate();
    const {body,isMine,isSeenByMe,createdat,image}=lastMessage??{};
   const unread=lastMessage&&!isMine&&!isSeenByMe;
    const slicedFriends=members.slice(0,3);
      
  return (
    
    <div  onClick={()=>navigate(`/conversations/${id}`)} 
      className={`w-full  rounded-lg p-3 flex gap-2 hover:bg-gray-300
         items-center cursor-pointer  space-x-3  space-y-2 transition mb-2 ${selected?'bg-rose-400':'bg-white'}`}
    >
        {
          type=="group"?<GroupAvatar slicedFriends={slicedFriends}/>:
          <Avatar className="h-9 w-9"  image={avatar}/>}
           <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                <p className="text-md font-medium text-gray-900">{title }</p>
                <p className="text-xs font-medium text-gray-500">{createdat?new Date(createdat).toLocaleTimeString():""}</p>

                </div>
                <p className={`text-xs truncate my-1 ${(!unread&&body)?'font-normal':'font-extrabold'}`}>
                  {isMine&&'You:'} {body?body:(image?"Sent Image ":"Start a Chat to see conversation")}</p>
           </div>
    </div>
  )
}

export default ConversationBox