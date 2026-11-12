import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";

export const useGetMe=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch()
   return  useQuery({queryKey:["getme"],queryFn: async()=>{
      const res=await apiPrivate.get("/auth/getme");
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
}