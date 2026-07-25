import axios from 'axios';
import {Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import {useState} from 'react';
import Auth from './components/Auth/Auth';
import api from './api/api';
import { setUser } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import Page from './components/Users/Page';
import GuestRoute from './Routes/GuestRoute';
import PrivateRoute from './Routes/PrivateRoute';
import type { AppDispatch } from '../store/store';
import Conversation from './components/Conversations/Conversation';
const App = () => {
  const dispatch=useDispatch<AppDispatch>();
  const navigate= useNavigate();
  const {data,isLoading}=useQuery({queryKey:["getme"],queryFn: async()=>{
      const res=await api.get("/auth/getme");
       if(!res.data.user){
         navigate("/auth")
       }
      dispatch(setUser(
         res.data.user
      )) 
      return res.data
   },

  
}
)
if(isLoading) return <p>App Loading....</p>
   return <div className="h-screen">
<Routes>

<Route element={<GuestRoute />}>
  <Route path="/auth" element={<Auth/>} />
</Route>
<Route element={<PrivateRoute  />}>
  <Route path="/users" element={<Page/>} />
  <Route path="/conversations/:conversationId?" element={<Page/>} />
</Route>
   <Route path='*' element={<div>404 path not found</div>}/>
</Routes>
   
   </div>

  
}

export default App
