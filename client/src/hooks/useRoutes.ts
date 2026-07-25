import { HiArrowLeftOnRectangle,HiUsers } from "react-icons/hi2";
import { HiChat } from "react-icons/hi";
import useConversation from "./useConversation";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
const  useRoutes=()=>{
    const pathname=useLocation().pathname
    const {conversationId}=useConversation();
    return useMemo(()=>(
        [{
            label:"chat",
            icon:HiChat,
            href:"/conversations",
            active:pathname==="/conversations" || !!conversationId       
        },{
            label:"users",
            icon:HiUsers,
            href:"/users",
            active:pathname==="/users"
        },{
            label:"logout",
            icon:HiArrowLeftOnRectangle,
            href:"#",
            onClick:()=>{}
        }]
    ),[pathname,conversationId])

}
export default useRoutes