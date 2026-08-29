import React from 'react'
import { useForm } from 'react-hook-form';

const Settings = () => {
    const{watch,control} =useForm({
        mode:"onChange"
    })

    const image=watch("image");

  return (
    <div>Settings</div>
  )
}

export default Settings