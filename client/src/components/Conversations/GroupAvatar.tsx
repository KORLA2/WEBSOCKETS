import React from 'react'
import type { User } from '../../types/User';
import Avatar from '../Avatar';
type GroupProps={
    slicedFriends:User[]|undefined
}

const GroupAvatar = ({slicedFriends}:GroupProps) => {

 const Friendsimg=[
  'top-0 left-[12px]',
  'bottom-0',
  'bottom-0 right-0',
 ]
  return (
    <div className="w-11 h-11 relative  cursor-pointer">
        {
            slicedFriends?.map((friend,idx)=>
            <div key={friend.id} className={`absolute
                 rounded-full  overflow-hidden h-5.25 w-5.25  ${Friendsimg[idx]}`}>
                  <img src={friend.image||"/images/placeholder.png"}/>
                </div>
                )
        }
    </div>
  )
}

export default GroupAvatar