import React from 'react'
import Avatar from '../Avatar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import type { Conversation, ConversationListItem } from '../../types/Conversation';

type ConversationProps={
    data:ConversationListItem,
    selected:boolean
    id:string
}
const ConversationBox = ({data:{friendname,
  friendid,friendimge,lastmessage,lastmessageat,conversationid,seen 
},selected,id}:ConversationProps) => {
    const user=useSelector((state:RootState)=>state.authSlice);
    const navigate=useNavigate();
  return (
    <div  onClick={()=>navigate(`/conversations/${friendid}`)} 
      className={`w-full  rounded-lg p-3 flex gap-2 hover:bg-gray-300
         items-center cursor-pointer  space-x-3  space-y-2 transition mb-2 ${selected?'bg-rose-400':'bg-white'}`}
    >
        <Avatar className="h-9 w-9" image={user.image}/>
           <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                <p className="text-md font-medium text-gray-900">{friendname }</p>
                <p className="text-xs font-medium text-gray-500">{new Date(lastmessageat).toLocaleTimeString()}</p>

                </div>
                <p className={`text-xs truncate my-1 ${seen?'font-medium':'font-extrabold'}`}>{lastmessage}</p>
           </div>
    </div>
  )
}

export default ConversationBox