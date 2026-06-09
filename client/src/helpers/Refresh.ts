import { useDispatch } from "react-redux";
import api, { apiPrivate } from "../api/api";
import store from "../../store/store";
import { setAccessToken } from "../../store/slices/authSlice";

export const RefreshToken= async()=>{
 const res=await api.get("/auth/refresh",{
  withCredentials:true
 });

store.dispatch(setAccessToken({
accessToken:res.data.accessToken
}))
return res.data.accessToken
}

