import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
type MessageProps={
    placeholder:string;
    id:string;
    register:UseFormRegister<FieldValues>;
    errors:FieldErrors,
    required:boolean;
}

const MessageInput = ({placeholder, id, register, errors, required}:MessageProps) => {
  return (
    <div className="w-full relative">
        <input
          {...register(id , {required})}
          placeholder={placeholder}
            
            className="w-full outline-none   bg-neutral-100 px-4 py-2   rounded-lg focus:ring-2 focus:ring-blue-500"
        />
    </div>
  )
}

export default MessageInput