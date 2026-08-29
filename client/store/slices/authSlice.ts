import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

type Auth={
    userId:string,
    email? :string,
    name?:string,
    image?:string
    accessToken:string
}
const initialState:Auth={
    userId:'',
    name:"",
    email:"",
    image:"",
    accessToken:"",
}

const authSlice = createSlice({
name:"authSlice",
initialState,
reducers:{
  
   setUser(state,action:PayloadAction<Auth>){ return action.payload},

   setAccessToken:(state,action)=>{
    state.accessToken=action.payload.accessToken
   },
   logout:()=>initialState
   
   
}   

})


export const {setUser,setAccessToken,logout}=authSlice.actions
export default authSlice.reducer;
