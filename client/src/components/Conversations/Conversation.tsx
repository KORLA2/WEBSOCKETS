import {useQuery} from "@tanstack/react-query";
import api, { apiPrivate } from "../../api/api";
import Header from "./Header"
import Body from "./Body";
import Form from "./Form";
import { useOtherUser } from "../../hooks/useOtherUser";
import useConversation from "../../hooks/useConversation";
import { CurrentConversationProvider } from "./CurrentConversationContext";
type Params={
  id: string | undefined
}

const Conversation = ({id}: Params) => {
  const {myFriends}=useConversation();

  const OtherUser=myFriends?.find(friend=>friend.id==id)
  const fetchConversation=async(id:string | undefined)=>{
    const res=await apiPrivate.get(`/conversations/${id}`);
    return res.data;
  }

  const {data,isLoading,isError}=useQuery({
    queryKey:["conversation",id],
    queryFn:()=>fetchConversation(id),
    enabled:!!id,
  });
console.log("Mydata is ",data)
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
        <CurrentConversationProvider value={{currentConversation: OtherUser}}>
          <Header OtherUser={OtherUser} type={OtherUser?.type=='group'} />
          <Body conversation={data?.messages}/>
          <Form/>
        </CurrentConversationProvider>
      </div>
    </div>
  )
}

export default Conversation



