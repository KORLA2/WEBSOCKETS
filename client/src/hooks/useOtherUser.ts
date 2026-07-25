import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../api/api";
import type { User } from "../types/User";
import { useMemo } from "react";

type GetUserType={
    user:User
}
export const useOtherUser=(id:string)=>{

    const {data,isLoading}=useQuery({queryKey:["otherUser"],queryFn:async()=>{
        console.log("My Id is ",id)
            const res=await apiPrivate.get<GetUserType>(`/auth/otherUser/${id}`);
            return res.data;
    }})
     console.log(data);
     return {
        OtherUser:data?.user
     }
}