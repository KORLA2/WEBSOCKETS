import { useMemo } from "react";
import type {Conversation} from "../../types/Conversation"
import type { User } from "../../types/User";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "../Avatar";


const Header = ({OtherUser}:{OtherUser:User|undefined}) => {
console.log(OtherUser)
// const statusText=useMemo(()=>{

//   if(conversation.isGroup) return conversation.users.length+" members"; 
//     return "Online"
// },[conversation])

  return (
    <div className="bg-white w-full  lg:px-6 px-4 py-3 flex justify-between items-center border-b  shadow-sm">
     <div className="flex gap-3 items-center">
      <Link to={`/conversations`} className=" lg:hidden block">
      <HiChevronLeft size={32} className="text-sky-500 cursor-pointer hover:text-gray-700 transition"/>
      </Link>
      <Avatar/>
      <div className="flex flex-col">
        <div>
        {OtherUser?.name}
        </div>
        <div className=" text-xs ">
          Online
        </div>
      </div>
     </div>
  <HiEllipsisHorizontal size={32} className="text-rose-500 cursor-pointer hover:text-gray-700 transition"/>
    </div>
  )
}

export default Header