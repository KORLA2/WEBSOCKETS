import { useRef } from 'react';
import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useWebSocketContext } from '../../helpers/contexts/WebSocketContext';
type MessageProps={
    placeholder:string;
    id:string;
    register:UseFormRegister<FieldValues>;
    errors:FieldErrors,
    required:boolean;
    image:string,
    cid:string|undefined
}


const MessageInput = ({placeholder, id, register, required,image,cid}:MessageProps) => {
  const registration=register(id,{required});
const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);
const isTypingRef = useRef<boolean>(false);
const {wsRef}=useWebSocketContext()
const sendTypingEvent=(event:'typing:start'|'typing:stop')=>{
  const ws=wsRef.current
  if (ws?.readyState !== WebSocket.OPEN) return;

  ws.send(
    JSON.stringify({
      event,
      cid
    })
  );

 }

const handleTyping=()=>{

  if(!isTypingRef.current){
    sendTypingEvent('typing:start')
  }
  isTypingRef.current=true;

 if(typingTimeoutRef.current)
  clearTimeout(typingTimeoutRef.current)

  typingTimeoutRef.current=setTimeout(()=>{
    sendTypingEvent('typing:stop')
    isTypingRef.current=false;
   typingTimeoutRef.current=null;
    
  
  },2000)

}


  return (
    <div className="w-full relative">
      {image&&<img className="h-10 w-10  rounded-lg mb-2 cursor-pointer" src={image}/>}
        <input
          {...registration}
          onChange={(e)=>{registration.onChange(e) ; handleTyping()}}
          placeholder={placeholder}
            
            className="w-full outline-none  bg-neutral-100 px-4 py-2  rounded-lg  ring-2 ring-blue-500 ring-inset  focus:ring-rose-400  "
        />
    </div>
  )
}

export default MessageInput