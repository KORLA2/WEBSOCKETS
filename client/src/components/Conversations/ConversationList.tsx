import React, { useState } from 'react'
import useConversation from '../../hooks/useConversation';
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';
import GroupChat from './GroupChat';

const ConversationList = () => {
  const {myFriends,isOpen,conversationId}=useConversation();
  const [isGroup,setisGroup]=useState<boolean>(false);
  console.log(myFriends);
  return (
    <>
   { isGroup&&
      <GroupChat
       close={ ()=>setisGroup(false) }/>
      }
    <div className={`h-full lg:w-80  w-full bg-purple-300   lg:block overflow-y-auto border-r border-gary-200 pb-20  lg:pb-0  ${isOpen?'hidden':'block w-full left-0'} `}>
   <div className="px-5">
    <div className="flex justify-between mb-4 pt-4 items-center">
      <div className="text-neutal-700 text-2xl  font-bold">Messages</div>
      <div onClick={()=>setisGroup(!isGroup)} className="rounded-full cursor-pointer hover:opacity-75 bg-black p-2 text-rose-600 transition ">
       <MdOutlineGroupAdd size={20}/>
      </div>
    </div>
      {
        myFriends?.length?myFriends?.map((item)=><ConversationBox
          key={item.id}
          id={item.id}
          data={item}
          selected={item.id===conversationId}
        />):
        <div className="text-sm font-medium text-neutral-500">
          No Chats 😔 Dont feel shy ‼️ start to chat with the people you know
        </div>
      }
    

   </div>

    </div>
    </>

  )
}

export default ConversationList