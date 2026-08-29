import React from 'react'
import ReactSelect from 'react-select'
import type { FieldValues, UseFormRegister } from 'react-hook-form';

type SelectProps={
   label:string,
   value:Record<string,any>,
   onChange:(value:Record<string,any>)=>void,
   options:Record<string,any>[],
   disabled:boolean
}

const Select = ({label,value,onChange,
               options,disabled
}:SelectProps) => {

  return (
    <div className="z-100 ">
        <label className="leading-6 block text-sm font-medium text-gray-900">{label}</label>
            <div className="mt-2">
                Selct the Group Memebers 
                <ReactSelect 
                isDisabled={disabled}
                isMulti
                value={value}
                onChange={onChange}
                options={options}
                // menuPortalTarget={document.body}
                // styles={{
                //     menuPortal:(base)=>({
                //         ...base,
                //         zIndex:9000
                //     })
                // }}
                classNames={{
                    control:()=>'text-sm mt-2'
                }}
                />

            </div>
    </div>
  )
}           

export default Select