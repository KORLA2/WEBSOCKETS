import React from 'react'
import type { Message } from '../../types/Message';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import Avatar from '../Avatar';

const MessageBox = ({message,isLast}:{message:Message,isLast:boolean}) => {

  const userId=useSelector((state:RootState)=>state.authSlice.userId)
const isMyMessage=message.senderid===userId;
console.log(userId);
const seenList=(message.seen||[]).filter(user=>user.id!==userId).map(user=>user.name).join(",");

const container=`flex gap-3 items-center  p-4 ${isMyMessage?'justify-end':''}`
const avatar=`${isMyMessage?'order-2':''}`
const body=`flex flex-col gap-2  ${isMyMessage?'items-end':''} `
const messages =`text-sm w-fit  text-wrap  overflow-hidden ${isMyMessage?'bg-rose-300 text-white text-right':'bg-gray-200'}
${message.image?'rounded-md p-0 ':'rounded-full py-2 px-3'}
`
  return (
    <div className={`${container} scroll-smooth`}>
     <div className={avatar}>
        <Avatar/>
     </div>
    <div className={body}>
        <div className="flex items-center gap-2 ">
            <div className="text-sm text-gray-500">{message.senderid}</div>
            <div className="text-xs text-neutral-800">{new Date(message.createdat).toLocaleTimeString()}</div>
        </div>
      <div className={messages}>
        {message.image?(<img src={message.image} className="object-cover cursor-pointer
         hover:scale-10 transition translate"/>):
      <div className="w-20">{message.body}</div>
        }
      </div>
    </div>

    </div>
  )
}

export default MessageBox