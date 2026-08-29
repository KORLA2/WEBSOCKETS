import { HiArrowLeftOnRectangle,HiUsers } from "react-icons/hi2";
import { HiChat } from "react-icons/hi";
import useConversation from "./useConversation";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../api/api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {logout} from "../../store/slices/authSlice"
const  useRoutes=()=>{
    const pathname=useLocation().pathname
    const {conversationId}=useConversation();
    const navigate=useNavigate();
    const queryClient=useQueryClient()
    const dispatch=useDispatch();
   const logOut= useMutation({
    mutationFn: async()=>{
        const res=await apiPrivate.post("/auth/logout");
        return res.data;
    },
    onSuccess:(data)=>{
        console.log("Logout Done");
        toast.success("SuccessFully Logged Out");
        dispatch(logout())
        queryClient.clear();
        navigate("/auth")
    },
    onError:()=>{
           toast.error("Something went wrong") 
    }

   })

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
            onClick:()=>{
                 logOut.mutate()  
            }
        }]
    ),[pathname,conversationId])

}
export default useRoutes