import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './contexts/auth'
import "./index.css"
import { SocketProvider } from './contexts/socket-io'
import { ModalProvider } from './contexts/modal'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <AuthContextProvider>
      <SocketProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </SocketProvider> 
    </AuthContextProvider>
)
