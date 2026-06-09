import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

type Auth={
    userId:string,
    accessToken:string
}
const initialState:Auth={
    userId:'',
    accessToken:"",
}

const authSlice = createSlice({
name:"authSlice",
initialState,
reducers:{
  
   setUser:(state,action:PayloadAction<{
    userId: string;
    accessToken: string;
  }>)=>{
   state.userId=action.payload.userId;
   state.accessToken=action.payload.accessToken

   },
   setAccessToken:(state,action)=>{
    state.accessToken=action.payload.accessToken
   }
}   

})

export const {setUser,setAccessToken}=authSlice.actions
export default authSlice.reducer;