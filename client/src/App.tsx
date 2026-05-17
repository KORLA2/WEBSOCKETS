import axios from 'axios';
import {useSearchParams} from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import {useState} from 'react';
import Auth from './components/Auth/Auth';
const App = () => {
  


   return <div className="h-full">
  <Auth/>
   </div>

  
}

export default App