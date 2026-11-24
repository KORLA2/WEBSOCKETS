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
    type:string,
    preview:string
    cid:string|undefined
}


const MessageInput = ({placeholder, id, register, preview,required,cid,file}:MessageProps) => {
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
const type=file?.[0]?.type;

const isImage=type?.startsWith("image")
const isAudio=type?.startsWith("audio")
const isVideo=type?.startsWith("video")

console.log("Type is ", type)
  return (
    <div className="w-full relative rounded-lg px-4 py-1 pb-2  ring-2 ring-blue-500 ring-inset  focus:ring-rose-400">
        <input
          {...registration}
          onChange={(e)=>{registration.onChange(e) ; handleTyping()}}
          placeholder={placeholder}
          
          className="w-full outline-none  px-4 py-2    "
          />

    {
      preview&&(
        <div>
           {isImage && (
      <img
        src={preview}
        alt="preview"
        className="w-40 h-40 object-cover rounded-lg"
      />
    )}

    {isVideo && (
      <video
        src={preview}
        controls
        className="w-60 rounded-lg"
      />
    )}

    {isAudio && (
      <audio
        src={preview}
        controls
      />
    )}

    {!isImage && !isVideo && !isAudio && (
      <div className="flex items-center gap-2">
        
        <span className="bg-neutral-200 px-3 py-2 rounded-lg ">{file[0].name}</span>
      </div>
    )}
        </div>
      )
    }
          

    </div>
  )
}

export default MessageInput