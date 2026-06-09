import axios from 'axios';
import {useSearchParams} from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import {useState} from 'react';
import Auth from './components/Auth/Auth';
import api from './api/api';
import { setUser } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
const App = () => {
  const dispatch=useDispatch();
  const {data,isLoading}=useQuery({queryKey:["getme"],queryFn: async()=>{
      const res=await api.get("/auth/getme");
      console.log(res)
      dispatch(setUser({
         userId:res.data.userId,
         accessToken:res.data.accessToken
      }))
      return res.data
   },

  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
}
)

   return <div className="h-screen">
  <Auth/>
   </div>

  
}

export default App