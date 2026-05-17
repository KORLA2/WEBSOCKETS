import {configureStore} from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
const store = configureStore({
    reducer:{
      appSlice:appReducer       
    }
})
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

