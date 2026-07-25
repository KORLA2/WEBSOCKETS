import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import conReducer from "./slices/ConversationSlice"
import userReducer from "./slices/UserSlice"
const store = configureStore({
    reducer:{
      authSlice:authReducer,
      conSlice: conReducer,
      userSlice:userReducer
    }
})
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
