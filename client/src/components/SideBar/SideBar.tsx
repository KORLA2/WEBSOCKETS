import { Link } from "react-router-dom";
import useRoutes from "../../hooks/useRoutes";
import { useSelector } from "react-redux";
import type {RootState} from "../../../store/store"
import {HiUsers} from "react-icons/hi"
import Avatar from "../Avatar";
const SideBar = () => {
     const routes=useRoutes();
const user=useSelector((state:RootState)=>state.authSlice)

  return (
    <div className="h-full">
    <div className="hidden h-full lg:inset-y-0 
          lg:left-0 lg:w-20 lg:z-40 lg:bg-rose-500
          xl:px-6 lg:overflow-y-auto lg:border-r
          lg:pb-4 lg:flex lg:flex-col justify-between
          ">

    <nav className="flex flex-col justify-between">
      <ul role="list"
       className="space-y-2 flex flex-col items-center"
      >
          {
                routes.map((item,idx)=>(
                    <li onClick={item.onClick}>
                        <Link className={`flex gap-x-3 group
                        rounded-md items-center p-3  text-sm leading-6 
                        font-semibold text-gray-500 hover:text-black hover:bg-gray-100 ${item.active?'bg-gray-100 text-red-800':''}`} to={item.href}>
                        <item.icon className="h-6 w-6 shrink-0"/>
                       <span className="sr-only">{item.label}</span>
                        </Link>
                    </li>      
                ))

          } 
      </ul>
    </nav>
    <nav className="flex flex-col items-center justify-center">
        <Avatar  image={user?.image}/>
    </nav>
    </div>

    </div>
  )
}

export default SideBar