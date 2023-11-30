import React, { useContext, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from "./contexts/authContext"

import './App.css'

import Home from './pages/Home'
import Logastro from './pages/Logastro'
import Perfil from './pages/Perfil'
import Note from './pages/Note'
import Kanban from './pages/Kanban'
import Initial from './pages/Initial'
import About from './pages/About'
import HorizontalNavbar from './components/HorizontalNavbar'
import Functionalities from './pages/Functionalities'
import Workspace from './pages/Workspace'
import Sidebar from './components/Sidebar'
import Project from './pages/Project'
import Desktop from './pages/Desktop'
import Board from './pages/Board'


const Layout = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <>
      <HorizontalNavbar/>
      <div className="outlet p-header-top">
        {/*{currentUser ? <Sidebar/> : <></>}*/}
        <Outlet/>
      </div>
    </>
  )
}

const router = createBrowserRouter ([
  {
    path:'/', element: <Layout/>,
    children:[
      {
        path:'/', element: <Initial/>,
      },
      {
        path:'/sobre', element: <About/>
      },
      {
        path:'/funcionalidades', element: <Functionalities/>
      },
      {
        path:'/desktop', element: <Workspace/>
      },
      {
        path:'/boards', element: <Board/>
      },
      {
        path:'/desktop/:des_id', element: <Desktop/>
      },
      {
        path:'/desktop/:des_id/project/:pro_id', element: <Project/>
      },
      {
        path:'/desktop/:des_id/project/:pro_id/frame/:fra_id', element: <Project/>
      },
      {
        path:'/note/:id', element: <Note/>
      },
      {
        path:'/perfil', element: <Perfil/>
      },
      {
        path:'/kanban', element: <Kanban/>
      },
      {
        path:'/logastro', element: <Logastro/>
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
