import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {  signUpSchema, type SignUpType } from './AuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/slices/authSlice';
import type { RootState } from '../../../store/store';
type SignInCardProps={
    change:()=>void
}


const SignUpCard = ({change}:SignInCardProps) => {

  const dispatch=useDispatch()
const {register,handleSubmit,formState:{isSubmitting,errors},setError,reset}=useForm<SignUpType>({
  resolver:zodResolver(signUpSchema),
  mode:"onBlur"
})
const mutation=useMutation({
  mutationFn:async(data:SignUpType)=>{
  
   const res= await  api.post("/auth/signUp",data)
      return res.data 
  },
onSuccess:(data)=>{
dispatch(setUser({
    userId:data.userId,
    accessToken:data.accessToken
  }))
  reset();
},
onError:(err:any)=>{
console.log("The Error is ",err.response,err);
setError("email",{message:err.response.data.message})
}
     })
 


const handleForm=(data:SignUpType)=>{
 
mutation.mutate(data)
}

  return (
    <div className="h-full p-8">
    <div className="px-0 pt-0 pb-3 font-medium text-xl">Log In to Continue </div>
   <div className="text-sm text-gray-800">Use Email or another device to continue  </div>
   <div className="px-0 pb-0 space-y-2.5">
    <form className="space-y-5 py-3"  onSubmit={handleSubmit(handleForm)}>
       
       {<>
        {errors.name&&<p  className="bg-green-100 px-5 py-2 w-full text-red-800 rounded-lg">{errors.name?.message}</p>}
         <input {...register('name')} required  placeholder="Name" className="w-full focus:border-blue-800 outline-none ring-2 ring-gray-800 focus:ring-blue-800  sm:text-sm sm:leading-6 rounded-lg  p-2 "/>
       </>
       }
       {<>
        {errors.email&&<p  className="bg-green-100 px-5 py-2 w-full text-red-800 rounded-lg">{errors.email?.message}</p>}
         <input {...register('email')} required  placeholder="Email" className="w-full outline-none rounded-lg ring-2 ring-gray-800 focus:ring-blue-800  sm:text-sm sm:leading-6 p-2 "/>
       </>
       }
       {
          <>
         {errors.password&&<p  className="bg-green-200  px-5 py-2 text-red-800 rounded-lg">{errors.password?.message}</p>}
         <input  {...register('password')} required type="password" placeholder="Password" className="w-full ring-2 ring-gray-800 focus:ring-blue-800  sm:text-sm sm:leading-6 rounded-lg outline-none  pr-10 pl-2 py-2 "/>
          </>
      }
      {
        <>
         {errors.confirmPassword&&<p  className="bg-green-200 px-5 py-2 text-red-800 rounded-lg">{errors.confirmPassword?.message}</p>}
        <input required type="password" {...register('confirmPassword')} placeholder=" Confirm Password" className="w-full ring-2 ring-gray-800 focus:ring-blue-800  sm:text-sm sm:leading-6 rounded-lg outline-none  pr-10 pl-2 py-2 "/>
        </>
      }
       <button type="submit" className="w-full bg-gray-800 text-white p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition"> {mutation.isPending?"Loading...":"SignUp" }</button>
    </form>
      <div className="relative">
      <div className="absolute inset-0 flex items-center " >
    <div className="w-full h-[0.6px] bg-gray-400"/>
      </div>
      <div className="flex relative  justify-center text-sm ">
 <div className="bg-white px-2 ">OR Continue with</div>
      </div>
    </div>
    <div className="flex flex-col gap-y-2">
    <button className="w-full p-2  flex justify-center items-center gap-2 relative border-gray-700 rounded-xl cursor-pointer bg-gray-300 hover:bg-gray-200 transition">
        <FcGoogle className=" size-5 " /> 
         Sign In with Google </button>      
    <button className="w-full p-2  flex justify-center items-center gap-2 relative border-gray-700 rounded-xl cursor-pointer bg-gray-300 hover:bg-gray-200 transition">
        <FaGithub className=" size-5 " /> 
         Sign In with Github </button> 
    </div>
    <p>
Already have  an Account? <span onClick={()=>{change(); reset()}} className="text-sky-700 hover:underline cursor-pointer">Sign In</span> 
    </p>
   </div>
    </div>
  )
}


export default SignUpCard














