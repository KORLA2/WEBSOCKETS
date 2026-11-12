import { useContext, useEffect, useState } from "react";
import type {ConversationListItem} from "../../types/Conversation"
import { Link, useNavigate } from "react-router-dom";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "../Avatar";
import ProfileDrawer from "./ProfileDrawer";
import useConversation from "../../hooks/useConversation";
import { FiAlertTriangle } from "react-icons/fi";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { apiPrivate } from "../../api/api";
import GroupAvatar from "./GroupAvatar";
import { CurrentConversationProvider, useCurrentConversation } from "./CurrentConversationContext";
import { useGetMe } from "../../hooks/useGetMe";
type HeaderProps={
  OtherUser:ConversationListItem|undefined,
  type:boolean|undefined,
}

const Header = () => {
const {conversationId}=useConversation();

const {currentConversation}=useCurrentConversation();
console.log("My Conversation specific is ",currentConversation)
const [IsOpen,setIsOpen]=useState<boolean>(false);
const [isdelete,setDelete]=useState<boolean>(false);
const{title,members,groupimage,isgroup}=currentConversation??{};
const navigate=useNavigate();
const queryClient=useQueryClient();
const {data}=useGetMe();
const {user}=data
let  slicedFriends,membersWithMe;
if(isgroup){
  const {name:_,...rest}=user;
  membersWithMe=[
    { id:user.userId,
      ...rest,
      isMe:true
    },
    ...(members??[])
  ]
  slicedFriends=membersWithMe.slice(0,3);
}


const mutation=useMutation({mutationFn:async()=>{
  const res=await apiPrivate.delete("/conversations/delete/"+conversationId);
  return res.data;
},
onSuccess:(data)=>{
  console.log(data,"Successfully Deleted");
  queryClient.invalidateQueries({queryKey:["conv"]});
  queryClient.invalidateQueries({queryKey:["conversation",""+conversationId]});

  navigate("/conversations");
},
onError:(err)=>{
  console.error(err,"Error occurred while deleting conversation")
}

}
)

const handleDeleteConversation=async()=>{
    mutation.mutate(); 
}
  return (
    <div className="bg-white w-full  lg:px-6 px-4 py-3 flex justify-between items-center border-b  shadow-sm">
     <div className="flex gap-3 items-center">
      <Link to={`/conversations`} className=" lg:hidden block">
      <HiChevronLeft size={32} className="text-sky-500 cursor-pointer hover:text-gray-700 transition"/>
      </Link>
      {isgroup?(groupimage?<Avatar image={groupimage}/>:<GroupAvatar slicedFriends={slicedFriends}/>):<Avatar image={members?.[0]?.image}/>}
      <div className="flex flex-col">
        <div>
        {title}
        </div>
        {!isgroup?<div className=" text-xs ">
          Online
        </div>:<div>{members?.length?members.length+1:""} members</div>}
      </div>
     </div>
  <HiEllipsisHorizontal onClick={()=>setIsOpen((prev)=>!prev)} size={32} className="text-rose-500 cursor-pointer hover:text-gray-700 transition"/>
    {
      IsOpen&&(
        <div className="fixed backdrop-blur-2xl   bg-pink-500/30 right-0 bottom-0 top-0 z-1000  ">
           <ProfileDrawer isGroup={isgroup}  setIsOpen={setIsOpen} setDelete={setDelete} slicedFriends={slicedFriends} membersWithMe={membersWithMe}/>
        </div>
      )
    }
     {
        isdelete&&(
        <div className=" absolute z-10 left-1/2 top-1/2 -translate-1/2 bg-rose-500/20 backdrop-blur-2xl rounded-xl">
            <div className="flex flex-col gap-4  justify-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10 sm:mx-0 ">
              <FiAlertTriangle className="text-red-500 h-6 w-6 " size={32}/>
              </div>
              <div className="text-center mt-3 sm:text-left sm:ml-4 sm:mt-0">
              <p className="leading-6 text-sm text-gray-900">Do you really want to delete this Conversation?</p>
              </div>
              <div className="flex gap-3  justify-end">
              <button onClick={()=>handleDeleteConversation()} disabled={mutation.isPending} className="bg-rose-600/50 px-4 py-2 cursor-pointer rounded-lg text-white hover:bg-red-700 transition disabled:bg-gray-500"> {mutation.isPending ? "Deleting..." : "Yes"}</button>
              <button onClick={()=>setDelete((prev)=>!prev)} className="bg-gray-600 px-4 py-2 cursor-pointer rounded-lg text-white hover:bg-gray-700 transition">No</button>
              </div>
            </div>
        </div>
        )
       }  
    </div>
  )
}

export default Header
