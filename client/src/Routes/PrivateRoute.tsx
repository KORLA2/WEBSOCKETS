import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../store/store';

const PrivateRoute = () => {
  const userId =useSelector((state:RootState)=>state.authSlice.userId)

    if(userId=="") return <h1>Private Laoding...</h1>
    if(!userId)
        return <Navigate to="/auth" replace />
return <Outlet/>
    
}

export default PrivateRoute