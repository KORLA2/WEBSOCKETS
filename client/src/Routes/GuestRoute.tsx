import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../store/store";

const GuestRoute = () => {
  const userId =useSelector((state:RootState)=>state.authSlice.userId);
  if(!userId)return <Outlet/>

    if(userId){
    return <Navigate to="/users" replace />
  }
    // return <Outlet/>

}

export default GuestRoute