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
import { useCurrentConversation } from './CurrentConversationContext';
import { useGetMe } from '../../hooks/useGetMe';
type  ProfileDrawerProps={
   setDelete:React.Dispatch<React.SetStateAction<boolean>>,
   setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileDrawer = ({setIsOpen,setDelete,slicedFriends,membersWithMe}:ProfileDrawerProps) => {
const {currentConversation}=useCurrentConversation();
const {members,groupimage,isgroup,title,updatedAt}=currentConversation??{};


if(!members?.length) return; 
  return (
    <div className="sm:w-sm max-sm:w-screen">
        <div className="cursor-pointer px-3 py-5 flex justify-end" onClick={()=>{setIsOpen((prev)=>!prev);setDelete(false)}}>
        <MdClose size={32} />
        </div>
      <div className="flex flex-col gap-4 items-center">
        {isgroup?(!groupimage?<GroupAvatar slicedFriends={slicedFriends} />:<Avatar image={groupimage}/>):<Avatar image={members[0].image}/>}
        <div className="text-center pointer-events-none">
        <p className="font-medium text-xl">{title}</p>
       {!isgroup?<p className="text-gray-700"> Online</p>:
       <p>{membersWithMe?.length} members</p>
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
          { !isgroup?<> 
            <div className="flex gap-2 max-sm:flex-col">
                <p className="text-xl text-neutral-700">Email:</p>
                <p className="text-xl max-sm:text-sm text-neutral-900  wrap-break-word">{members[0]?.email}</p>
            </div>
            <div className="flex  gap-2 max-sm:flex-col">
                <p className="text-xl text-neutral-700">Joined On:</p>
                <p className="text-xl max-sm:text-sm text-neutral-900">{
                updatedAt ? new Date(updatedAt).toLocaleDateString("en-US",{
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
                membersWithMe?.map((member)=> 
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