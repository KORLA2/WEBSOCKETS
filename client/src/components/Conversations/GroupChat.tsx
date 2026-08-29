import React, { useState } from 'react'
import { useForm, type FieldValues } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiPrivate } from '../../api/api';
import { required } from 'zod/mini';
import { data } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import Select from './Select';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

const GroupChat = ({ close }: { close: () => void }) => {
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const userId=useSelector((state:RootState)=>state.authSlice.userId)
let  {data:users=[]}=useUsers();
  users=users.filter(user=>user.id!==userId);

   const {register,handleSubmit,watch,reset,setValue,formState:{errors}}=useForm<FieldValues>({
    defaultValues:{
        groupName:"",
        members:[]
    }

   });
   const members:{value:string,label:string}[]=watch("members");
  const mutation=useMutation({
   mutationFn:async(data:FieldValues)=>{
    console.log(data);
  const memberIds=[...members.map((member)=>member.value),userId]
  console.log(memberIds);
     const res= await  apiPrivate.post("/conversations/creategroup",{
        members:memberIds,
        name:data.groupName,
        isGroup:true
      })
      return res;
   },
   onSuccess:(data)=>{
      reset();
      close();
   },
   onError:(err)=>{
    console.log("Error ",err)  
  }  

  })
     
   const onSubmit=async(data:FieldValues)=>{
    console.log(data,members)
      if(members.length>=2)
        mutation.mutate(data); 
   }
  return (
    <div className="h-full w-full fixed  top-0 left-0 z-1000 bg-white/30">
        <form onSubmit={handleSubmit(onSubmit)} className="absolute  top-1/2  bg-white  p-5 rounded-xl left-1/2 w-md max-sm:w-full  -translate-1/2 z-1000 " >
          <div className="space-y-12">
            <div className="pb-10 border-b border-gray-900/30">
                <p className="font-semibold leading-7 text-base text-gray-900">Group Chat</p>
                <p className="text-sm leading-6 mt-1 text-gray-800"> Create a Chat with more than 2 People</p>
                <div className="mt-1 flex flex-col gap-y-8">
                   <div className="w-full flex flex-col gap-y-3 ">
                      <label>Group Name</label>
                      <input {...register('groupName')} required  disabled={mutation.isPending} className="w-full outline-none transition disabled:cursor-not-allowed disabled:bg:neutral-500  bg-neutral-100 px-4 py-2  ring-2 ring-blue-500 ring-inset  focus:ring-rose-400 rounded-lg"/> 
                   </div> 
                  <Select
                   disabled={mutation.isPending}
                   label="Members"
                     options={users.map(user=>({
                       value:user.id,
                       label:user.name
                     }))}
                     onChange={(value)=>setValue("members",value)}
                     value={members}
                  >
                  </Select>
                </div>
            </div>
          </div>  
          <div className="flex justify-end items-center  gap-x-6 mt-6">
            <button onClick={()=>close()} type="button" className="px-4 py-3 rounded-lg cursor-pointer  bg-blue-400 hover:bg-blue-500 transition">Cancel </button>
            <button type="submit" className="px-4 py-3 rounded-lg cursor-pointer  bg-rose-400 hover:bg-rose-500 transition">Create Group </button>
          </div>
        </form>
    </div>
  )
}

export default GroupChat