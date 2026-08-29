import { useQuery } from '@tanstack/react-query';
import  { apiPrivate } from '../api/api';
import type { User } from '../types/User';

export const useUsers = () => {
 
    return useQuery({
    queryKey:["userList"],
    queryFn:async()=>{
     const res=await apiPrivate.get<{users:User[]}>("/users/allusers");
     return res.data.users;
    },
   
 })

}

