import EmptyState from "./EmptyState";
import SideBar from "../SideBar/SideBar";
import MobileFooter from "../SideBar/MobileFooter";
import UserList from "./UserList";
import { useLocation } from "react-router-dom";
import ConversationList from "../Conversations/ConversationList";
import useConversation from "../../hooks/useConversation";
import Conversation from "../Conversations/Conversation";
const Page = () => {
    const {pathname}=useLocation();
    const {isOpen,conversationId}=useConversation();
    console.log(isOpen)
  return (<div className="h-full flex">
    <div className={` lg:flex-1 flex w-full ring-10 ${isOpen?'max-lg:hidden':'block'} ring-inset ring-blue-500`}>

    <SideBar/>
  
    {pathname==="/users"?<UserList/>:<ConversationList />}
    </div>

    <MobileFooter/>
    <div className='lg:flex-3 flex-1  w-full'>
      <div className={`h-full w-full ${isOpen?'hidden':'max-lg:hidden block'}`}>
        <EmptyState/>
      </div>
     { isOpen&&<div className={`h-full w-full `}>
          <Conversation key={conversationId} id={conversationId}/>
      </div>
      }
    </div>
  </div>
  )
}

export default Page