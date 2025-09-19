import React,{useState,useEffect} from 'react';
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth';
import './App.css'
import { login,logout } from './store/authSlice';
import { Header, Footer } from './components';
import { Outlet } from 'react-router-dom';
// import { BrowserRouter } from 'react-router-dom';

 export default function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }

    })
    .finally(() => setLoading(false))
  }, [dispatch])

 
  return !loading ? (
   
    <div className='flex flex-wrap content-between min-h-screen bg-gray-400'>
      <div className='block w-full'>
        <Header />
        <main>
        <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  
  ): null
}
