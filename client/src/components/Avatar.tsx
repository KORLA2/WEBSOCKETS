import React from 'react'

const Avatar = ({image,className}:{image?:string|null,className?:string}) => {
    const classes= className||"w-9 h-9  md:w-11 md:h-11"
  return (
    <div className={`relative cursor-pointer overflow-hidden ${classes}`}>
           <img src={image||`/images/placeholder.png`} className=" w-full rounded-full  h-full object-cover"/>
           <div className="absolute  bg-green-500   top-0 ring-white ring-inset ring-2 right-0 h-3 w-3 rounded-full "/>
        </div>
  )
}

export default Avatar