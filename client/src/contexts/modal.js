import { createContext, useContext, useState } from 'react'

export const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState(false)
    const [inputType, setInputType] = useState("")
    const [inputOperation, setInputOperation] = useState("")
    const [inputItem, setInputItem] = useState("")

    const setModalState = (props) => {
        setInputType(props.type)
        setInputOperation(props.operation)
        setInputItem(props.item)
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    return (
        <ModalContext.Provider value={{ openModal, inputType, inputOperation, inputItem, setModalState, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}