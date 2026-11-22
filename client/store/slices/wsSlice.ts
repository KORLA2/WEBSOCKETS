import { createSlice } from "@reduxjs/toolkit";

 const  initialState:{
    ws:null|WebSocket
 }={
    ws:null,
 }


const wsSlice=createSlice({
    name:"wsSlice",
    initialState,
    reducers:{
        setWebSocket(state,action){
            console.log(action.payload,"Action.Payload")
            state.ws=action.payload;
        }
    }
})

export const {setWebSocket}=wsSlice.actions;
export default wsSlice.reducer;