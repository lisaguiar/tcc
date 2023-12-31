import React, { useState, useEffect } from "react"
import "../styles/Error.css"
import { FiAlertTriangle } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'

function ErrorDisplay({ message }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    setIsVisible(true)
  }, [message])

  return (
    <>
      {isVisible && (
        <div className="alert alert-primary">
          <div className="icon__wrapper">
            <span className="mdi mdi-alert-outline"><FiAlertTriangle/></span>
          </div>
          <p>{message}</p>
          <span className="mdi mdi-close close" onClick={() => handleClose()}><AiOutlineClose/></span>
        </div>
      )}
    </>
  )
}

export default ErrorDisplay