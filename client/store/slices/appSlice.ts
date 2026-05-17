import {createSlice,nanoid} from "@reduxjs/toolkit"
type Game={
    id:string,
    title:string,
    content:string
}

const initialState={
    count:0,
}

const appSlice = createSlice({
    name:"appSlice",
    initialState,
    reducers:{
        increase:(state)=>{
        state.count+=10;
        },       
        decrease:(state)=>{
            state.count-=10;
        }
    }

})
export const  TrackCount=(state)=>state.appSlice.count;

export const{increase,decrease}=appSlice.actions;
export default appSlice.reducer;