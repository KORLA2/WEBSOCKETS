import { Link } from "react-router-dom";
import useRoutes from "../../hooks/useRoutes";
import { useSelector } from "react-redux";
import type {RootState} from "../../../store/store"
import {HiUsers} from "react-icons/hi"
import Avatar from "../Avatar";
import { useEffect, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "../../api/api";
import toast from "react-hot-toast";
const SideBar = () => {
     const routes=useRoutes();
const user=useSelector((state:RootState)=>state.authSlice)
 const [OpenSettings,setOpenSettings]=useState<boolean>(false);
 const queryClient=useQueryClient();
 const {register,handleSubmit,formState:{errors,isSubmitting},setValue,watch,reset,setError}=useForm<FieldValues>({
  defaultValues:{
    name:user?.name,
    image:undefined
  }
 });
const image=watch('image');
const selectedImage = image instanceof FileList && image.length > 0 ? image[0] : undefined;
const preview =
    selectedImage
        ? URL.createObjectURL(selectedImage)
        : user.image;

const mutation=useMutation({
    mutationFn:async(data:FieldValues)=>{
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }
      await apiPrivate.patch("/users/update",formData);
    },
    onSuccess:(data)=>{
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getme"] });
      setOpenSettings(false);

    },
    onError:(err)=>{
      toast.error("Failed to update profile. Please try again.");
      setOpenSettings(false);
    }
})
const UpdateProfile=(data:FieldValues)=>{
  console.log("My Data is :",data)
mutation.mutate(data)
}
  return (
    <div className="h-full">
    <div className="hidden h-full lg:inset-y-0 
          lg:left-0 lg:w-20 lg:z-40 lg:bg-rose-500
          xl:px-6 lg:overflow-y-auto lg:border-r
          lg:pb-4 lg:flex lg:flex-col justify-between
          ">

    <nav className="flex flex-col justify-between">
      <ul role="list"
       className="space-y-2 flex flex-col items-center"
      >
          {
                routes.map((item,idx)=>(
                    <li onClick={item.onClick}>
                        <Link className={`flex gap-x-3 group
                        rounded-md items-center p-3  text-sm leading-6 
                        font-semibold text-gray-500 hover:text-black hover:bg-gray-100 ${item.active?'bg-gray-100 text-red-800':''}`} to={item.href}>
                        <item.icon className="h-6 w-6 shrink-0"/>
                       <span className="sr-only">{item.label}</span>
                        </Link>
                    </li>      
                ))

          } 
      </ul>
    </nav>
    <nav onClick={()=>setOpenSettings((prev)=>!prev)} className="flex flex-col items-center justify-center">
        <Avatar  image={user?.image}/>
    </nav>
    </div>
      {

        OpenSettings&&(
          <div className="h-full w-full fixed backdrop-blur-2xl top-0 left-0 z-1000 bg-white/30">
          <form onSubmit={handleSubmit(UpdateProfile)} className="absolute  top-1/2  bg-white  p-5 rounded-xl left-1/2 w-md max-sm:w-full  -translate-1/2 z-1000  ">
            <div className="font-semibold text-xl  ">Edit Your Profile</div>
            <div className="flex flex-col gap-4 justify-center p-4">
              <div>
              <label className="font-normal text-xl text-neutral-800"> Name:</label>
              <input type="text" placeholder="Enter your name"  {...register('name')} className="border border-gray-400 px-5 py-3 w-full outline-none rounded-lg"/>
               </div>
               <label className="font-normal text-xl text-neutral-800">Profile Photo:</label>
               <div className="flex gap-x-3 items-center  ">
              <Avatar image={preview}/>
              <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                {...register('image')}  
              />
              <label
                htmlFor="profile-image"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
                Change Profile Photo
            </label>
              </div>
              <div className="flex  gap-3 justify-end">
            <button  type="submit" disabled={mutation.isPending} className="bg-rose-500  text-white  rounded-lg px-4 py-2 hover:bg-rose-800 transition disabled:opacity-50 disabled:cursor-not-allowed   cursor-pointer ">Update</button>
            <button  onClick={()=>setOpenSettings((prev)=>!prev)} className="bg-gray-500  text-white  rounded-lg px-4 py-2 hover:bg-gray-700 transition   cursor-pointer ">Cancel</button>
              </div>
            </div>
          </form>
          </div>
        )
      }
    </div>
  )
}

export default SideBar
