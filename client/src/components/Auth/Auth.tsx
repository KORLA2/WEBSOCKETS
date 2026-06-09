import React, { useState } from 'react'
import type { SignInFlow } from './types';
import SignInCard from './SignInCard';
import SignUpCard from './SignUpCard';
const Auth = () => {
    const [state,setState]=useState<SignInFlow>("signIn");

  return (
    <div className='flex  flex-col justify-center px-2  bg-[#5C3B58] min-h-full py-12   sm:px-6 lg:px-8'>
     <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8 bg-white rounded-lg p-4">
     <img src="/images/logo.png" alt="Logo" className="mx-auto h-10 w-auto"/>
      {
        state=="signIn"?<SignInCard change={()=>setState("signUp")}/>:<SignUpCard change={()=>setState("signIn")}/>
      }
      </div>
    </div>
  )
}

export default Auth