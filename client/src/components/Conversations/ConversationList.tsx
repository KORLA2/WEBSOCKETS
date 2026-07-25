import React from 'react'
import useConversation from '../../hooks/useConversation';
import { MdOutline10K, MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';

const ConversationList = () => {
  const {myFriends,isOpen,receiverId}=useConversation();
  console.log(myFriends)
  return (
    <div className={`h-full lg:w-80  w-full bg-purple-300   lg:block overflow-y-auto border-r border-gary-200 pb-20  lg:pb-0  ${isOpen?'hidden':'block w-full left-0'} `}>
   <div className="px-5">
    <div className="flex justify-between mb-4 pt-4 items-center">
      <div className="text-neutal-700 text-2xl  font-bold">Messages</div>
      <div className="rounded-full cursor-pointer hover:opacity-75 bg-black p-2 text-rose-600 transition ">
       <MdOutlineGroupAdd size={20}/>
      </div>
    </div>
      {
        myFriends?myFriends!.map((item)=><ConversationBox
          key={item.friendid}
          id={item.friendid}
          data={item}
          selected={item.friendid===receiverId}
        />):
        <div className="text-sm font-medium text-neutral-500">
          No Chats 😔 Dont feel shy ‼️ start to chat with the people you know
        </div>
      }
    
   </div>

    </div>
  )
}

export default ConversationList