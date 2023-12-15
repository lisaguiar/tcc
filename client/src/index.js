import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './contexts/auth'
import "./index.css"
import { SocketProvider } from './contexts/socket-io'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <AuthContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider> 
    </AuthContextProvider>
)
