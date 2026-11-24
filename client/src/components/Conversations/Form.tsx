import React, { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';
import useConversation from '../../hooks/useConversation';
import { HiMusicalNote, HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { useMutation } from "@tanstack/react-query"
import { apiPrivate } from '../../api/api';
import MessageInput from './MessageInput';
import { IoIosAttach } from 'react-icons/io';
import { MdAttachFile } from 'react-icons/md';
import FileInput from '../Attachments/FileInput';
import { IoDocumentSharp } from 'react-icons/io5';
const Form = () => {
const {conversationId}=useConversation();
const [isAttachCicked,setIsAttachClicked]=useState(false);
console.log(isAttachCicked)
    const [fileInputKey,setFileInputKey]=React.useState(0);
    const {register, setValue, handleSubmit,watch,resetField,formState:{errors},setError}=useForm<FieldValues>({
        defaultValues:{
            message:"",
            image:null
        }
    })
    const attachment=watch('attachment');
const  preview=React.useMemo(()=>
 attachment?.length>0?URL.createObjectURL(attachment[0]):"",[attachment]);
console.log(preview)
React.useEffect(()=>{
  return ()=>{
    if(preview) URL.revokeObjectURL(preview);
  }
},[preview])

const mutation=useMutation({
    mutationFn:async(data:FieldValues)=>{
       const formData= new FormData();
       formData.append('message',data.message||"");
        if (data.attachment instanceof FileList && data.attachment.length > 0) {
          console.log("Adding Attcahment")
          formData.append("attachment",data.attachment[0]);

      }
        formData.append("conversationId",conversationId!)
         const res=await apiPrivate.post("/message/send",formData)
         return res.data;
    },
    onSuccess:()=>{
        setValue("message","")
        resetField("attachment")
        setIsAttachClicked(false);
        setFileInputKey((key)=>key+1)
   
    },
    onError:(err)=>{
      console.log(err?.response?.data)
        setValue("message","")
        resetField("attachment")
    
      }

  })

    const handleForm:SubmitHandler<FieldValues>=async(data:FieldValues)=>{
        const hasMessage=typeof data.message==="string"&&data.message.trim().length>0;
        const hasAttachment=data.attachment instanceof FileList && data.attachment.length > 0;
        console.log(data.attachment[0]);
        if(!hasMessage&&!hasAttachment){
          setError("message",{message:"Message or Attachment required"})
          return;
        }
        mutation.mutate(data)
    }

  return (
    <div className="px-6 py-4 bg-white flex relative  items-center gap-2 lg:gap-4 w-full border-t">
    
    <form  onSubmit={handleSubmit(handleForm)} className="flex items-center gap-2 lg:gap-4 w-full">
      
       <label htmlFor="attachment" className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
      <MdAttachFile size={30}  className="text-sky-500 cursor-pointer hover:text-gray-700 transition"/>
    </label> 
        <input
           id='attachment'
          type="file"
          className="hidden"
          {...register('attachment')}  
          /> 
      <MessageInput 
      placeholder="Enter a message..."
      id="message"
      register={register}
      cid={conversationId}
      preview={preview}
      file={attachment}
      errors={errors}
      required={false}
      />
      <button type="submit" disabled={mutation.isPending} className="bg-sky-500 hover:bg-sky-600 transition text-white p-2 rounded-full disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed">
      <HiPaperAirplane  size={20} className=""/>
      </button>
        </form>

    </div>
  )
}

export default Form
