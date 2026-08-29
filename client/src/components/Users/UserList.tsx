import React from 'react'
import UserBox from './UserBox';
import { useUsers } from '../../hooks/useUsers';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';


const UserList = () => {
let  {data:users=[],isLoading,isError}=useUsers();
const userId=useSelector((state:RootState)=>state.authSlice.userId)
 users=users?.filter((user)=>user.id!==userId);

  return (
    <div className="fixed inset-y-0 lg:left-20 border-r bg-amber-400  border-gray-900 w-full lg:w-80 block left-0 pb-20 lg:pb-0   overflow-y-auto">
       <div className="px-5">
        <div className="flex flex-col gap-2 ">
           <div className="text-2xl font-bold py-4 flex flex-col gap-2 text-neutral-800"><p>Trending People</p> <p className="text-sm  font-medium text-neutral-700">Start a chat with Them</p> </div>
           {isLoading&&<p className="text-sm text-neutral-700">Loading users...</p>}
           {isError&&<p className="text-sm text-red-700">Unable to load users</p>}
            {
                users.map((user,idx)=>(
                    <UserBox key={user.id} user={user}/>
                ))
            }
            </div>
       </div>
    </div>
  )
}

export default UserList
