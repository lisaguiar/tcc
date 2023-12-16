import React, { useContext } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { AuthContext } from "./contexts/auth"
import { AuthenticatedRoute, UnauthenticatedRoute } from './middleware/route'
import './App.css'

import Logastro from './pages/Logastro' 
import Home from './pages/Home'
import HorizontalNavbar from './components/HorizontalNavbar'
import Sidebar from './components/Sidebar'
import Project from './pages/Project'
import Desktop from './pages/Desktop'
import Board from './pages/Board'
import Member from './pages/Member'
import Frame from './pages/Frame'
import Account from './pages/Account'

const Layout = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <>
      <HorizontalNavbar/>
      <div className="outlet p-header-top">
        <Outlet/>
      </div>
    </>
  )
}

const router = createBrowserRouter ([
  {
    path: '/', 
    element: <Layout/>,
    children: [
      {
        path: '/', 
        element: <UnauthenticatedRoute element={<Home/>} />
      },
      {
        path: '/sign-up', 
        element: <UnauthenticatedRoute element={<Logastro/>} />
      },
      {
        path: '/u/:use_id/boards', 
        element: <AuthenticatedRoute element={<Board/>} />
      },
      {
        path: '/u/:uda_id/desktop/:des_id', 
        element: <AuthenticatedRoute element={<Desktop/>} />
      },
      {
        path: '/u/:uda_id/desktop/:des_id/members', 
        element: <AuthenticatedRoute element={<Member/>} />
      },
      {
        path: '/u/:uda_id/project/:pro_id', 
        element: <AuthenticatedRoute element={<Project/>} />
      },
      {
        path: '/u/:uda_id/project/:pro_id/frame/:fra_id', 
        element: <AuthenticatedRoute element={<Frame/>} />
      },
      {
        path: '/u/:use_id/account',
        element: <AuthenticatedRoute element={<Account/>} />
      },
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
