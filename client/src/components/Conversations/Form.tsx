import React from 'react'
import { useForm, type FieldValues } from 'react-hook-form';
import useConversation from '../../hooks/useConversation';
import { HiMiniPaperAirplane, HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { useMutation } from "@tanstack/react-query"
import api, { apiPrivate } from '../../api/api';
import MessageInput from './MessageInput';
import {useSelector} from "react-redux"
import type { RootState } from '../../../store/store';
const Form = () => {
const {receiverId}=useConversation()
const accessToken=useSelector((state:RootState)=>state.authSlice.accessToken);
    const {register, setValue, handleSubmit,formState:{errors,isSubmitting},setError,reset}=useForm<FieldValues>({
        defaultValues:{
            message:""
        }
    })

  const mutation=useMutation({
    mutationFn:async(data:FieldValues)=>{
         const res=await apiPrivate.post("/messages/send",{
            ...data,
            receiverId:receiverId,
            
         },
        )
         return res.data;
    },
    onSuccess:(data)=>{
        setValue("message","")
    },
    onError:(err)=>{
        setValue("message","")
    
      }

  })

    const handleForm=async(data:FieldValues)=>{
        mutation.mutate(data)
    }

  return (
    <div className="px-6 py-4 bg-white flex items-center gap-2 lg:gap-4 w-full border-t">
    <HiPhoto size={30} className="text-sky-500 cursor-pointer hover:text-gray-700 transition"/>
    <form  onSubmit={handleSubmit(handleForm)} className="flex items-center gap-2 lg:gap-4 w-full">
      <MessageInput 
      placeholder="Enter a message..."
      id="message"
      register={register}
      errors={errors}
      required
      />
      <button type="submit" disabled={mutation.isPending} className="bg-sky-500 hover:bg-sky-600 transition text-white p-2 rounded-full disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed">
      <HiPaperAirplane  size={20}className=""/>
      </button>
        </form>

    </div>
  )
}

export default Form