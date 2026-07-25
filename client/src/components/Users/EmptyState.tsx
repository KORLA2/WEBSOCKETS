
const EmptyState = ({message}:{message?:string}) => {
  return (
    <div
     className="flex items-center justify-center h-full   bg-red-100  px-4 py-10 sm:px-6 lg:px-8 "
    >
        <div className="text-center items-center flex flex-col">
            <p className=" text-2xl font-semibold">{ message?message:"Select a chat to start  Conversation"  }</p>
        </div>

    </div>
  )
}

export default EmptyState