import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

type SignInCardProps={
    change:()=>void
}
const SignInCard = ({change}:SignInCardProps) => {
  return (
    <div className="w-full h-full p-8">
    <div className="px-0 pt-0 pb-3 font-medium text-xl">Log In to Continue </div>
   <div>Use Email or another device to continue  </div>
   <div className="px-0 pb-0 space-y-2.5">
    <form className="space-y-5 py-3">
       <input required  placeholder="Email" className="w-full outline-none border-2 border-black p-2 "/>
       <input required type="password" placeholder="Password" className="w-full outline-none border-2 border-black pr-10 pl-2 py-2 "/>
       <button  type="submit" className="w-full bg-gray-800 text-white p-3 rounded-xl cursor-pointer hover:bg-gray-700 transition"> SignIn </button>
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
Don't have an account? <span onClick={()=>change()} className="text-sky-700 hover:underline cursor-pointer">Sign Up</span> 
    </p>
   </div>
    </div>
  )
}

export default SignInCard