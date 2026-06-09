import {createSlice} from '@reduxjs/toolkit';

type AppState={ 
    val:string
}
const initialState:AppState={
    val:""
}
const appSlice = createSlice({
name:"appSlice",
initialState,
reducers:{
}}
)
export default appSlice.reducer;