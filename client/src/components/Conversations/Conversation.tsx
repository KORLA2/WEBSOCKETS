import {useQuery} from "@tanstack/react-query";
import api, { apiPrivate } from "../../api/api";
import Header from "./Header"
import Body from "./Body";
import Form from "./Form";
import { useOtherUser } from "../../hooks/useOtherUser";
type Params={
  id: string | undefined
}

const Conversation = ({id}: Params) => {

  const fetchConversation=async(id:string | undefined)=>{
    const res=await apiPrivate.get(`/conversations/${id}`);
    return res.data;
  }

   const {OtherUser}=useOtherUser(id!);
  const {data,isLoading}=useQuery({queryKey:["conversation",id],queryFn:()=>fetchConversation(id)});

   

   console.log(data)
  return (
    <div className="flex lg: h-full w-full bg-orange-200 ">
      <div className="h-full flex w-full flex-col">
        <Header  OtherUser={OtherUser} />
        <Body  conversation={data?.messages}/>
        <Form/>
      </div>
    </div>
  )
}

export default Conversation