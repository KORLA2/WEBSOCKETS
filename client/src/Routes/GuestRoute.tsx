import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = ({ userId }: { userId?: string }) => {
  if(userId=="")
    return <h1>Loading...</h1>

    if(userId){
    return <Navigate to="/users" replace />
  }
    return <Outlet/>

}

export default GuestRoute