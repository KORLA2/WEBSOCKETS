import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ userId }: { userId?: string }) => {
    if(userId=="") return <h1>Loading...</h1>
    if(!userId)
        return <Navigate to="/auth" replace />
return <Outlet/>
    
}

export default PrivateRoute