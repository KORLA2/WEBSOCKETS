import React from 'react'
import Avatar from '../Avatar';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/User';

const UserBox = ({user}:{user:User}) => {
    const navigate=useNavigate();
  return (
    <div onClick={()=>navigate(`/conversations/${user.id}`)} className="w-full bg-white hover:bg-gray-300 
    flex items-center space-x-3 p-2 rounded-lg  transition-all transition-200 cursor-pointer">
   <Avatar className="h-9 w-9" image={user.image}/>
   <div className="flex-1 min-w-0">
  <div className="focus:outline-none">
    <div className="flex justify-between items-center mb-1 ">
   <p className="text-sm font-medium text-gray-900">{user.name}</p>
    </div>
  </div>
   </div>
    </div>
  )
}

export default UserBox
