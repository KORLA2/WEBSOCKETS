import axios from 'axios';
import store from '../../store/store';
import { RefreshToken } from '../helpers/Refresh';

const api = axios.create({
baseURL:'/api',
})
export  const apiPrivate=axios.create({
    baseURL:"/api",
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
    }
})


apiPrivate.interceptors.request.use((config)=>{
    const token=store.getState().authSlice.accessToken;
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
},err=>Promise.reject(err))

apiPrivate.interceptors.response.use((response)=>response,async(error)=>{
    const prevRequest=error.config;
   if(error.response.status==403&&!prevRequest.sent){
         const newAccessToken= await RefreshToken();
         prevRequest.sent=true;
 prevRequest.headers['Auhthorization']=`Bearer ${newAccessToken}`
 return apiPrivate(prevRequest)
   }
    return Promise.reject(error)
})





export default api;

