import {createSlice} from "@reduxjs/toolkit"
import type {User} from "../../src/types/User"

const initialState:{TrendingPeople:User[]}={
  TrendingPeople:[]
}
const userSlice=createSlice({
 name:"userslice",
 initialState,
 reducers:{
   setTrendingPeople:(state,action)=>{
      state.TrendingPeople=action.payload
   }
 }

})
export const {setTrendingPeople}=userSlice.actions;

export default userSlice.reducer