import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {  signUpSchema, type SignUpType } from './AuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';

type SignInCardProps={
    change:()=>void
}
const SignUpCard = ({change}:SignInCardProps) => {
const {register,handleSubmit,formState:{isSubmitting,errors},setError,reset}=useForm<SignUpType>({
  resolver:zodResolver(signUpSchema),
  mode:"onChange",
})

  return (
    <div className="w-full h-full p-8">
    <div className="px-0 pt-0 pb-3 font-medium text-xl">Log In to Continue </div>
   <div className="text-sm text-gray-800">Use Email or another device to continue  </div>
   <div className="px-0 pb-0 space-y-2.5">
    <form className="space-y-5 py-3">
       {<>
        {errors.email&&<p  className="bg-green-100 px-5 py-2 w-full text-red-800 rounded-lg">{errors.email?.message}</p>}
         <input {...register('email')} required  placeholder="Email" className="w-full outline-none border-2 border-black p-2 "/>
       </>
       }
       {
          <>
         {errors.Password&&<p  className="bg-green-200  px-5 py-2 text-red-800 rounded-lg">{errors.Password?.message}</p>}
         <input  {...register('Password')} required type="password" placeholder="Password" className="w-full outline-none border-2 border-black pr-10 pl-2 py-2 "/>
          </>
      }
      {
        <>
         {errors.confirmPassword&&<p  className="bg-green-500 text-red-500 rounded-lg">{errors.confirmPassword?.message}</p>}
        <input required type="password" placeholder=" Confirm Password" className="w-full outline-none border-2 border-black pr-10 pl-2 py-2 "/>
        </>
      }
       <button  type="submit" className="w-full bg-gray-800 text-white p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition"> Sign Up </button>
    </form>
    <div className="w-full h-[0.6px] bg-gray-400"/>
    <div className="flex flex-col gap-y-2">
    <button className="w-full p-2  flex justify-center items-center gap-2 relative border-gray-700 rounded-xl cursor-pointer bg-gray-300 hover:bg-gray-200 transition">
        <FcGoogle className=" size-5 " /> 
         Sign In with Google </button>      
    <button className="w-full p-2  flex justify-center items-center gap-2 relative border-gray-700 rounded-xl cursor-pointer bg-gray-300 hover:bg-gray-200 transition">
        <FaGithub className=" size-5 " /> 
         Sign In with Github </button> 
    </div>
    <p>
Already have  an Account? <span onClick={()=>change()} className="text-sky-700 hover:underline cursor-pointer">Sign In</span> 
    </p>
   </div>
    </div>
  )
}


export default SignUpCard