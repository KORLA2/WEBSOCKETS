import {useQuery} from "@tanstack/react-query";
import api, { apiPrivate } from "../../api/api";
import Header from "./Header"
import Body from "./Body";
import Form from "./Form";
import { useOtherUser } from "../../hooks/useOtherUser";
import useConversation from "../../hooks/useConversation";
import { CurrentConversationProvider } from "../../helpers/contexts/CurrentConversationContext";
import { useMessages } from "../../hooks/useMessages";
type Params={
  id: string | undefined
}

const Conversation = ({id}: Params) => {
  const {myconversations}=useConversation();

  const conversation=myconversations?.find(conv=>conv.id===id)
  const {isLoading,isError}=useMessages(id);
  if(isLoading) 
    return <p>Loading....</p>
  if(isError){
    return (
        <div className="h-full flex items-center justify-center">
        <p className="text-sm text-red-500">
          You are not allowed to access this conversation.
        </p>
      </div>
    )
    
  }  
  return (
    <div  className="flex lg: h-full w-full bg-orange-200 ">
      <div className="h-full flex w-full flex-col">
        <CurrentConversationProvider value={{currentConversation: conversation}}>
          <Header/>
          <Body id={id} />
          <Form/>
        </CurrentConversationProvider>
      </div>
    </div>
  )
}

export default Conversation



