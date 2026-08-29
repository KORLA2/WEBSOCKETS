import React, { useState } from 'react'
import { MdClose, MdDelete } from 'react-icons/md';
import Avatar from '../Avatar';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { boolean } from 'zod';
import type { ConversationListItem } from '../../types/Conversation';
import type { User } from '../../types/User';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import GroupAvatar from './GroupAvatar';
type  ProfileDrawerProps={
   OtherUser:ConversationListItem|undefined,
   isGroup:boolean|undefined,
   setDelete:React.Dispatch<React.SetStateAction<boolean>>,
   setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileDrawer = ({isGroup,OtherUser,setIsOpen,setDelete}:ProfileDrawerProps) => {
const{members}=OtherUser??{};
const slicedFriends=OtherUser?.members.slice(0,3);
if(!members?.length) return; 
  return (
    <div className="sm:w-sm max-sm:w-screen">
        <div className="cursor-pointer px-3 py-5 flex justify-end" onClick={()=>{setIsOpen((prev)=>!prev);setDelete(false)}}>
        <MdClose size={32} />
        </div>
      <div className="flex flex-col gap-4 items-center">
        {isGroup?<GroupAvatar slicedFriends={slicedFriends} />:<Avatar image={OtherUser?.avatar}/>}
        <div className="text-center pointer-events-none">
        <p className="font-medium text-xl">{OtherUser?.title}</p>
       {!isGroup?<p className="text-gray-700"> Online</p>:
       <p>{members?.length} members</p>
       }
        </div>
        <div className="flex  flex-col items-center">

        <div onClick={()=>setDelete((prev)=>!prev)} className="cursor-pointer hover:bg-red-700/30 p-3 rounded-full">
        <RiDeleteBin5Fill size={22}/>
        </div>
       <p className="text-xl text-gray-700 pointer-events-none">Delete Chat</p>
        </div>
        <div className="p-2 w-full">
       <div className="border border-red-700/70 w-full "/>
        </div>
      </div>
        <div className="px-3 py-5 space-y-3">
          { !isGroup?<> 
            <div className="flex gap-2 max-sm:flex-col">
                <p className="text-xl text-neutral-700">Email:</p>
                <p className="text-xl max-sm:text-sm text-neutral-900  wrap-break-word">{members[0]?.email}</p>
            </div>
            <div className="flex  gap-2 max-sm:flex-col">
                <p className="text-xl text-neutral-700">Joined On:</p>
                <p className="text-xl max-sm:text-sm text-neutral-900">{
                OtherUser?.updatedAt ? new Date(OtherUser.updatedAt).toLocaleDateString("en-US",{
                        month:'short',
                        day:'numeric',
                        year:'numeric'
                    }
                )
              : 'N/A'}</p>
            </div>
            </>:
           <div className="space-y-2 overflow-y-auto">
              Group Members:
               
              {
                members.map((member)=> 
                <div className="flex gap-2 p-3 items-center">
                  <Avatar image={member.image}/>
                  <p className="text-2xl">{member.isMe?"You": member.name}</p>
                </div>
                )
               
              }

           </div>
}
        </div> 
      
    </div>
  )
}

export default ProfileDrawer