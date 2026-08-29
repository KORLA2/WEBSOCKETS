import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
type MessageProps={
    placeholder:string;
    id:string;
    register:UseFormRegister<FieldValues>;
    errors:FieldErrors,
    required:boolean;
    image:string
}

const MessageInput = ({placeholder, id, register, required,image}:MessageProps) => {
  return (
    <div className="w-full relative">
      {image&&<img className="h-10 w-10  rounded-lg mb-2 cursor-pointer" src={image}/>}
        <input
          {...register(id , {required})}
          placeholder={placeholder}
            
            className="w-full outline-none  bg-neutral-100 px-4 py-2  rounded-lg  ring-2 ring-blue-500 ring-inset  focus:ring-rose-400  "
        />
    </div>
  )
}

export default MessageInput