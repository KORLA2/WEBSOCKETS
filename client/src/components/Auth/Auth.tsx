import React, { useState } from 'react'
import type { SignInFlow } from './types';
import SignInCard from './SignInCard';
import SignUpCard from './SignUpCard';
const Auth = () => {
    const [state,setState]=useState<SignInFlow>("signIn");

  return (
    <div className='flex justify-center items-center bg-[#5C3B58] h-full'>
     <div className="md:h-auto md:w-100  bg-white rounded-lg p-4">
      {
        state=="signIn"?<SignInCard change={()=>setState("signUp")}/>:<SignUpCard change={()=>setState("signIn")}/>
      }
      </div>
    </div>
  )
}

export default Auth