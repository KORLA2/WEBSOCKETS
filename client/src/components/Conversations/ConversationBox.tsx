import React from 'react'
import Avatar from '../Avatar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import type { Conversation, ConversationListItem } from '../../types/Conversation';
import GroupAvatar from './GroupAvatar';
import { formatTime } from '../../helpers/formtTime';
import { useGetMe } from '../../hooks/useGetMe';

type ConversationProps={
    data:ConversationListItem,
    selected:boolean
    id:string,
    
}
const ConversationBox = ({
  data:{groupimage,title,lastMessage,isgroup,members,lastReadAt,unreadCount},
  selected,id}:ConversationProps) => {
    const navigate=useNavigate();
    const {body,isMine,createdAt,image}=lastMessage??{};
   unreadCount=Number(unreadCount);
   const {data}=useGetMe();
const {user}=data??{}
let  slicedFriends,membersWithMe;
  if(isgroup){
  const {name:_,...rest}=user??{};
  membersWithMe=[
    { id:user?.userId,
      ...rest,
      isMe:true
    },
    ...(members??[])
  ]
  slicedFriends=membersWithMe.slice(0,3);
}
  return (
    
    <div  onClick={()=>navigate(`/conversations/${id}`)} 
      className={`w-full  rounded-lg p-3 flex gap-2 hover:bg-gray-300
         items-center cursor-pointer  space-x-3  space-y-2 transition mb-2 ${selected?'bg-rose-400':'bg-white'}`}
    >
        {
          isgroup?(groupimage?<Avatar className="h-9 w-9"  image={groupimage}/>:<GroupAvatar slicedFriends={slicedFriends}/>):
          <Avatar className="h-9 w-9"  image={image}/>}
           <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                <p className="text-md font-medium text-gray-900">{title}</p>
                <p className="text-xs font-medium text-gray-500">{createdAt?formatTime(createdAt):""}</p>

                </div>
                <div className="flex justify-between">
                <p className={`text-xs truncate my-1 ${(!unreadCount||isMine)?'font-normal':'font-extrabold'}`}>
                  {isMine&&'You:'} {body?body:(image?"Sent Image ":"Start a Chat to see conversation")}</p>
                {unreadCount&&!isMine?<div className="bg-green-600 text-white text-xs h-6 min-w-6 rounded-full flex items-center justify-center">{unreadCount<=9?unreadCount:'9+'}</div>:""}
                </div>
           </div>
    </div>
  )
}

export default ConversationBox