import {createRoot} from 'react-dom/client';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import "./index.css"
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import store from "../store/store"
import { Toaster } from 'react-hot-toast';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  }
});


createRoot(document.getElementById('root')!).render(
 
  <QueryClientProvider client={queryClient}>
   <BrowserRouter >
 <Provider store={store}>
    <Toaster/>
      <App/>
 </Provider>
 </BrowserRouter>
  </QueryClientProvider>
   
)