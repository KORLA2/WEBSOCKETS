import React from 'react'
import type { Message } from '../../types/Message';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import Avatar from '../Avatar';
import { useCurrentConversation } from './CurrentConversationContext';
type MessageBoxProps={
  message:(Message&{
    sendername: string,
    seenby: string[],
  }),
  isLast: boolean
}

const MessageBox = ({message,isLast}:MessageBoxProps) => {

  const {userId, image}=useSelector((state:RootState)=>state.authSlice)
  const {currentConversation}=useCurrentConversation();
const isMyMessage=message.senderid===userId;
const seenList=(message.seenby||[]).join(",")
const OtherUserimage=currentConversation?.members.find(member=>member.id===message.senderid)?.image;
const container=`flex flex-col gap-3   p-4 ${isMyMessage?'items-end':''}`
const avatar=`${isMyMessage?'order-2':''}`
const body=`flex flex-col gap-2  `
const messages =`text-sm w-fit md:max-w-md max-w-72  break-words ${isMyMessage?'bg-rose-300 text-white text-right':'bg-gray-200'}
${message.image?'rounded-lg p-1':'rounded-lg py-2 px-3'}
`
console.log("MY MESSAGE LATEST", message)
  return (
    <div className={`${container} scroll-smooth`}>
      <div className="flex items-center gap-3 ">

            <div className="text-sm text-gray-500">{message.sendername}</div>
            <div className="text-xs text-neutral-800">{new Date(message.createdat).toLocaleTimeString()}</div>
      </div>

    <div className={body}>
        <div className="flex items-center gap-2 ">
               <div className={avatar}>
                  <Avatar image={isMyMessage ? image : OtherUserimage}/>
               </div>
      <div className={messages}>
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
     <div className="text-end">
        {
          isLast&&isMyMessage&&(seenList.length>0?(
              <div> Seen By {seenList}</div>
          ):<div>Sent</div>)
        }
     </div>
    </div>
  )
}

export default MessageBox
