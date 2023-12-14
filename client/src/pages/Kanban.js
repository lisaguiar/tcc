import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaRegStar, FaStar } from "react-icons/fa";
import { io } from 'socket.io-client';

const Kanban = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [starHover, setStarHover] = useState(false);

    function handleLogout() {
        logout();
        navigate('/logastro');
    }

    useEffect(() => {
        const socket = io('http://localhost:8000')
        socket.on('connect', () => {
            console.log('Conectado ao servidor do Socket.io')
          })
          socket.on('disconnect', () => {
            console.log('Desconectado do servidor do Socket.io')
          })
    })

    const data = [
        {
            id: "1",
            nome: "titulo 1",
            itens: [
                { id: "01", nome: "card 1" },
                { id: "02", nome: "card 2" },
            ],
            tint: 1
        },
        {
            id: "2",
            nome: "titulo 2",
            itens: [
                { id: "03", nome: "card 3" },
                { id: "04", nome: "card 4" },
            ],
            tint: 2
        },
        {
            id: "3",
            nome: "titulo 3",
            itens: [
                { id: "05", nome: "card 5" },
                { id: "06", nome: "card 6" },
            ],
            tint: 3
        }
    ];

    const [columns, setColumns] = useState(data);

    console.log(columns);

    const handleDragDrop = (results) => {
        const { source, destination, type } = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index)
            return;
        if (type === 'group') {
            const reorderedColumn = [...columns];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;

            const [removedColumn] = reorderedColumn.splice(sourceIndex, 1);
            reorderedColumn.splice(destinationIndex, 0, removedColumn);

            return setColumns(reorderedColumn);
        }

        const columnSourceIndex = columns.findIndex((column => column.id === source.droppableId));
        const columnDestinationIndex = columns.findIndex((column) => column.id === destination.droppableId);
        const newSourceItems = [...columns[columnSourceIndex].itens];
        const newDestinationItems = source.droppableId !== destination.droppableProps ? [...columns[columnDestinationIndex].itens] : newSourceItems;

        const [deletedItem] = newSourceItems.splice(source.index, 1);
        newDestinationItems.splice(destination.index, 0, deletedItem);

        const newColumns = [...columns];

        newColumns[columnSourceIndex] = {
            ...columns[columnSourceIndex],
            itens: newSourceItems
        };
        newColumns[columnDestinationIndex] = {
            ...columns[columnDestinationIndex],
            itens: newDestinationItems
        };
        setColumns(newColumns);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center mt-1">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4 bg-indigo-400 text-white px-4 py-2 rounded">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-3xl font-bold">Project Name</h2>
                        <div
                            className="cursor-pointer"
                            onMouseEnter={() => setStarHover(true)}
                            onMouseLeave={() => setStarHover(false)}
                        >
                            {starHover ? (
                                <FaStar className="text-yellow-500 w-6 h-6" />
                            ) : (
                                <FaRegStar className="text-white w-6 h-6" />
                            )}
                        </div>
                    </div>
                    <button className="bg-blue-950 text-white px-4 py-2 rounded">Compartilhar</button>
                </div>

                <div className='kanban'>
                    <DragDropContext onDragEnd={handleDragDrop}>
                        <Droppable droppableId="root" type="group">
                            {(provided) => (
                                <div className='flex' {...provided.droppableProps} ref={provided.innerRef}>
                                    {columns.map((column, index) => (
                                        <Draggable draggableId={column.id} key={column.id} index={index}>
                                            {(provided) => (
                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}
                                                    className="m-2 p-4 bg-gray-100 rounded-xl w-64">
                                                    <ColumnList {...column} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
};

function ColumnList({ nome, itens, id }) {
    return (
        <Droppable droppableId={id}>
            {(provided) => (
                <div className='kanban-container' {...provided.droppableProps} ref={provided.innerRef}>
                    <div className='column-container bg-gray-100 p-1 mb-2 rounded'>
                        <h3 className='text-sm font-semibold'>{nome}</h3>
                    </div>
                    <div className='itens-container'>
                        {itens.map((item, index) => (
                            <Draggable draggableId={item.id} index={index} key={item.id}>
                                {(provided) => (
                                    <div className='item-container bg-white p-4 mb-3 rounded-xl shadow-md' {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                        <h4 className='text-sm'>{item.nome}</h4>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

export default Kanban;
