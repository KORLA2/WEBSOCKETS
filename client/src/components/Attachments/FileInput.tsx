import React from 'react'
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import type { IconType } from 'react-icons';

type FileInputProps={
    Icon:IconType,
    register:UseFormRegister<FieldValues>,
    name:string,
    accept:string,
    label:string,
    id:string
}

const FileInput = ({Icon,register,name,accept,id,label}:FileInputProps) => {
  return (
  <div>
   <label htmlFor="profile-image" className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
        <p>{label}</p>
      <Icon size={30}  className="text-sky-500 cursor-pointer hover:text-gray-700 transition"/>
    </label> 
        <input
           id={id}
          type="file"
          accept={accept}
          className="hidden"
          {...register(name)}  
          /> 
  </div>
  )
}

export default FileInput