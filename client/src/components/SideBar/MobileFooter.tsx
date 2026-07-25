import React from 'react'
import useConversation from '../../hooks/useConversation';
import useRoutes from "../../hooks/useRoutes"
import { Link } from 'react-router-dom';
const MobileFooter = () => {
    const {isOpen}= useConversation();
    const routes=useRoutes()
    if(isOpen) return null;
  return (
    <div className="fixed bottom-0 w-full flex z-40  justify-between items-center bg-white  border-t lg:hidden  ">
        {   
            routes.map((item,idx)=>(
              <Link to={item.href} className={`
              flex gap-x-3 leading-6 font-semibold 
              text-sm w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100 ${item.active?"bg-gray-100 text-red-800":""}`}>
                <item.icon className="h-6 w-6"/>
              </Link>
            ))
        
        }

    </div>
  )
}

export default MobileFooter