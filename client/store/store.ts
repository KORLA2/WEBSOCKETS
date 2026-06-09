import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
const store = configureStore({
    reducer:{
      authSlice:authReducer,
      appSlice:appReducer,

    }
})
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

console.log(store.getState())