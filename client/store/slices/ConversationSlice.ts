import {createSlice} from "@reduxjs/toolkit"
import type {Conversation} from "../../src/types/Conversation"

const initialState:{Conversations:Conversation[]}={
  Conversations:[]
}
const conSlice=createSlice({
 name:"conslice",
 initialState,
 reducers:{
   setConversations:(state,action)=>{
      state.Conversations=action.payload
   }
 }

})
export const {setConversations}=conSlice.actions;

export default conSlice.reducer