import React from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';
import useConversation from '../../hooks/useConversation';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { useMutation } from "@tanstack/react-query"
import { apiPrivate } from '../../api/api';
import MessageInput from './MessageInput';
const Form = () => {
const {conversationId}=useConversation()
    const [fileInputKey,setFileInputKey]=React.useState(0);
    const {register, setValue, handleSubmit,watch,resetField,formState:{errors},setError}=useForm<FieldValues>({
        defaultValues:{
            message:"",
            image:null
        }
    })
    const image=watch('image')
const  preview=React.useMemo(()=>
 image?.length>0?URL.createObjectURL(image[0]):"",[image]);

React.useEffect(()=>{
  return ()=>{
    if(preview) URL.revokeObjectURL(preview);
  }
},[preview])
 

const mutation=useMutation({
    mutationFn:async(data:FieldValues)=>{
       const formData= new FormData();
       formData.append('message',data.message||"");
        if (data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
        formData.append("conversationId",conversationId!)
         const res=await apiPrivate.post("/messages/send",formData
        )
         return res.data;
    },
    onSuccess:()=>{
        setValue("message","")
        resetField("image")
        setFileInputKey((key)=>key+1)
   
    },
    onError:()=>{
        setValue("message","")
    
      }

  })

    const handleForm:SubmitHandler<FieldValues>=async(data:FieldValues)=>{
        const hasMessage=typeof data.message==="string"&&data.message.trim().length>0;
        const hasImage=data.image instanceof FileList && data.image.length > 0;
        if(!hasMessage&&!hasImage){
          setError("message",{message:"Message or image required"})
          return;
        }
        mutation.mutate(data)
    }

  return (
    <div className="px-6 py-4 bg-white flex items-center gap-2 lg:gap-4 w-full border-t">
    
    <form  onSubmit={handleSubmit(handleForm)} className="flex items-center gap-2 lg:gap-4 w-full">
   <label htmlFor="profile-image">
    <HiPhoto size={30}  className="text-sky-500 cursor-pointer hover:text-gray-700 transition"/>
    </label> 
        <input
          key={fileInputKey}
           id="profile-image"
          type="file"
          accept="image/*"
          className="hidden"
          {...register('image')}  
          />
      <MessageInput 
      placeholder="Enter a message..."
      id="message"
      register={register}
      image={preview}
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
