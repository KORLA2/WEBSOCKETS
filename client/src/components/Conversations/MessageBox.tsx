import React, { useState } from 'react'
import type { Message } from '../../types/Message';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import Avatar from '../Avatar';
import { useCurrentConversation } from './CurrentConversationContext';
import { formatTime } from '../../helpers/formtTime';
import { MdDelete, MdDeleteOutline, MdMenu } from 'react-icons/md';
import { FaDeleteLeft, FaEllipsis } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';
import { BsEye } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../../api/api';
type MessageBoxProps={
  message:(Message&{
    sendername: string,
    seenby: string[],
  }),
  isLast: boolean
}

const MessageBox = ({message,isgroup,showSeen,readStates}:MessageBoxProps) => {
const [menuOpen,setMenuOpen]=useState<boolean>(false)
  const {userId, image}=useSelector((state:RootState)=>state.authSlice)
  const {currentConversation}=useCurrentConversation();
const isMyMessage=message.isMine;
const {id}=message;
const seenList=readStates.filter(user=>user.lastReadAt&& (new Date(message.createdAt).getTime()<=new Date(user.lastReadAt).getTime()))
const OtherUserimage=currentConversation?.members.find(member=>member.id===message.senderid)?.image;
const container=` group  group-hover:cursor-pointer flex flex-col gap-3 w-full  p-2 ${isMyMessage?'items-end':''}`
const avatar=`${isMyMessage?'order-2':''}`
const body=`flex flex-col rounded-lg  gap-2 ${isMyMessage?'items-end':''}`
const messages =`text-sm w-fit md:max-w-md max-w-72  break-words ${isMyMessage?'bg-rose-400 text-white text-right':'bg-gray-200'}
${message.image?'rounded-lg p-1':'rounded-lg py-2 px-3'}
`
const queryClient=useQueryClient();
 const mutation=useMutation({
  mutationFn:async()=>{
    console.log("Deleting Message",message.id)
     const res= await apiPrivate.delete("/message/delete", 
       {
          data: {
            id: message.id,
          },
        }
     ); 
          return res.data;
  },
  onSuccess:(data)=>{
    console.log("Message Deleted Successfully",data)
// updating cache after deleting message
  queryClient.setQueryData(['conversation',message.conversationId], (old:any) => {
      if(!old){
        return old;
      }
      return {
        ...old,
        messages: old.messages.filter((msg:any) => msg.id !== message.id),
      }

  })
queryClient.invalidateQueries({queryKey:['conv']});


  },
  onError:(err)=>{
    console.log("Error Deleting Message",err.response?.data)
  }

 })
return (
    <div className={`${container} scroll-smooth `} >
      <div className="flex  items-center gap-3 ">

            <div className="text-sm text-gray-500">{message.senderName}</div>
            <div className="text-xs text-neutral-800">{formatTime(message.createdAt)}</div>
      </div>
     <div  className={` relative w-full flex items-center gap-2 ${
        isMyMessage ? "justify-end" : "justify-start"
      }`}>
      <div className={`absolute  group-hover:flex    
       top-0
      -translate-y-1/2
      hidden
      items-center
      gap-1
      z-50
      bg-white
      shadow-md
      rounded-lg
      p-1
      ${isMyMessage ? "left-0" : "right-0 "}
      `}
      >
      <button className="cursor-pointer"> 👍</button>
      <button  className="cursor-pointer">👎</button>

  { isMyMessage&&<button className='cursor-pointer' onClick={()=>{setMenuOpen(prev=>!prev)}}>
      <FaEllipsis/>
    </button>
  }
   {
    menuOpen&&(
      <div className={`absolute top-full mt-1
      bg-white
      rounded-lg
      shadow-lg
      p-2
      min-w-32
      translate-x-1/2
      ${isMyMessage ? "right-0" : "left-0"} `}> 
   {isMyMessage && (
    <>
    <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">
       <div onClick={()=>{mutation.mutate()}} className="flex gap-1  cursor-pointer items-center">
         <MdDeleteOutline   size={20}/>
        Delete
        </div>
       </button>

     { isgroup&&<div className="group/seen">
        <button
          className="
            flex
            justify-between
            w-full
            px-3
            py-2
            hover:bg-gray-100
          "
        >
          Seen 
          <span> ›</span>
        </button>
           <div
              className="
                hidden
                group-hover/seen:block
                absolute
                -right-full
                top-1/2
                bg-white
                shadow-lg
                rounded-lg
                p-2
                min-w-40
              "
            >
    {seenList.length ? (
      seenList.map(user => (
        <div
          key={user.userId}
          className="flex items-center  gap-2 px-2 py-1"
        >
          <Avatar image={user.image} />
          <span>{user.name}</span>
        </div>
      ))
    ) : (
      <span className="text-sm text-gray-500">
        Not seen yet
      </span>
    )}
  </div>
       
      </div>
   }
      </>
    )}

      </div>
    )
   }
      </div>
    <div className={`${body} group-hover:bg-gray-300/70 hover:cursor-pointer w-full`}>
        <div className="flex items-center gap-2 ">
               <div className={avatar}>
                  <Avatar image={isMyMessage ? image : OtherUserimage}/>
               </div>
      <div className={`${messages}`}>
        {message.image&&(<img src={message.image} className="object-cover rounded-lg max-h-72 w-full max-w-70 cursor-pointer
          transition translate"/>)
        }
        <p className="text-sm px-1 pt-2">
        {
          message.body
        }
        </p>
    
      </div>
        </div>
  
    </div>
    </div>
    {

      !isgroup&&showSeen&&<div >
         <div className="flex items-center gap-2"> 
          {
             seenList.length?<><p>Seen</p> <BsEye size={20}/></>:<><p>Sent</p> <TiTick size={30}/></>
          }
        
      </div>      
        
      </div>
    }
    </div>
  )
}

export default MessageBox
