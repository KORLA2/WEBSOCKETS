import axios from 'axios';
import {Route, Routes, useSearchParams} from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import {useState} from 'react';
import Auth from './components/Auth/Auth';
import api from './api/api';
import { setUser } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import Users from './components/Users/page';
import GuestRoute from './Routes/GuestRoute';
import PrivateRoute from './Routes/PrivateRoute';
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
<Routes>

<Route element={<GuestRoute userId={data?.userId}/>}>
  <Route path="/auth" element={<Auth/>} />
</Route>
<Route element={<PrivateRoute userId={data?.userId} />}>
  <Route path="/users" element={<Users/>} />
</Route>
   <Route path='*' element={<div>404 path not found</div>}/>
</Routes>
   
   </div>

  
}

export default App
