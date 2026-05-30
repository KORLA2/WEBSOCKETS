import {createSlice} from "@reduxjs/toolkit"

type Auth={
    userId:string,
    sessionId:string
}
const initialState:Auth={
    userId:'',
    sessionId:""
}

const authSlice = createSlice({
name:"authSlice",
initialState,
reducers:{

}   

})

export default authSlice.reducer;