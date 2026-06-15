import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import type { SignInFlow } from './types';
import { signInSchema, type SignInType } from './AuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import api, { apiPrivate } from '../../api/api';
import { useDispatch } from 'react-redux';
import {setUser} from "../../../store/slices/authSlice"
import { useNavigate } from 'react-router-dom';
type SignInCardProps={
    change:()=>void
}
const SignInCard = ({change}:SignInCardProps) => {
const dispatch=useDispatch();
const navigate=useNavigate();
const {register,handleSubmit,reset,formState:{isSubmitting,errors},setError}= useForm<SignInType>({
  resolver: zodResolver(signInSchema),
  mode:"onBlur"
})



  const mutation=useMutation({  
 mutationFn:async(data:SignInType)=>{
     const res= await api.post("/auth/signIn",data);
     return res.data;
 },
 onSuccess:(data)=>{
  console.log(data);
  dispatch(setUser({
    userId:data.userId,
    accessToken:data.accessToken
  }))

navigate("/users");
 },
 onError:(err:any)=>{
  console.log(err)
  setError("email",{message:err.response.data.message}) 
}
})
// React Query + mUtation to send data to the server and handle response
const handleForm= async(data:SignInType)=>{

mutation.mutate(data)

}

  return (
    <div className="w-full  h-full p-8">
    <div className="px-0 pt-0 pb-3 font-medium text-xl">Log In to Continue </div>
   <div>Use Email or another device to continue  </div>
   <div className="px-0 pb-0 space-y-2.5">
    <form onSubmit={handleSubmit(handleForm)}  className="space-y-5 py-3">
        {errors.email&&<p  className="bg-green-200  px-5 py-2 text-red-800 rounded-lg">{errors.email?.message}</p>}
       <input required {...register('email')}  placeholder="Email" className="w-full outline-none border-2 border-black p-2 focus:border-blue-800 rounded-lg"/>
        {errors.password&&<p  className="bg-green-200  px-5 py-2 text-red-800 rounded-lg">{errors.password?.message}</p>}
       <input required type="password" {...register('password')} placeholder="Password" className="w-full outline-none border-2 border-black pr-10 pl-2 py-2 rounded-lg focus:border-blue-800"/>
      
       <button  disabled={mutation.isPending} type="submit" className="w-full bg-gray-800 text-white p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition">{ mutation.isPending? "Loading..." :"SignIn" }</button>
    </form>
    <div className="relative">
      <div className="absolute inset-0 flex items-center" >
    <div className="w-full h-[0.6px] bg-gray-400"/>
      </div>
      <div className="flex relative  justify-center text-sm px-2">
 <div className="bg-white px-2 ">OR Continue with</div>
      </div>
    </div>

    <div className="flex flex-col gap-y-2">
    <button className="w-full p-2  flex justify-center  items-center gap-2 relative border-gray-700 rounded-xl cursor-pointer bg-gray-300 hover:bg-gray-200 transition">
        <FcGoogle className=" size-5 " /> 
         Sign In with Google </button>      
    <button className="w-full p-2  flex justify-center items-center gap-2 relative border-gray-700 rounded-xl cursor-pointer bg-gray-300 hover:bg-gray-200 transition">
        <FaGithub className=" size-5 " /> 
         Sign In with Github </button> 
    </div>
    <p>
Don't have an account? <span onClick={()=>{change(); reset()}} className="text-sky-700 hover:underline cursor-pointer">Sign Up</span> 
    </p>
   </div>
    </div>
  )
}

export default SignInCard


