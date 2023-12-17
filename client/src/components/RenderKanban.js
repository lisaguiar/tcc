import React, { useContext } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { ModalContext } from '../contexts/modal'

function Card ({ keys, index, card }) {
    const { setModalState } = useContext(ModalContext)
    return (
        <Draggable draggableId={card.kac_id.toString()} index={index} key={keys}>
            {(provided) => (
            <div
                key={keys}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className="bg-white p-4 mb-3 rounded-xl shadow-md cursor-pointer"
                onClick={() => {
                setModalState("cartão", "update", card)
                }}
            >
                <p className="text-sm">{card.kac_title}</p>
            </div>
            )}
        </Draggable>
    )
}

function ColumnList ({ keys, nome, katId, kanbanCards }) {
  return (
    <Droppable droppableId={katId.toString()} key={keys}>
      {(provided) => (
        <div
          key={keys}
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="kanban-container"
        >
        <div className="column-container bg-gray-100 p-1 mb-2 rounded">
          <h3 className="text-sm font-semibold">{nome}</h3>
        </div>
          <div className="itens-container">
            {kanbanCards &&
              kanbanCards.map((card, index) => (
                <div key={card.kac_id}>
                  <Card
                    keys={card.kac_id}
                    card={card}
                    index={index}
                    katId={katId}
                  />
                </div>
              ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

function RenderKanban({ kanbanTable, kanbanCards }) {
    const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result
    
      if (!destination) {
        return
      }
    
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return
      }
    
      const updatedCard = kanbanCards.find((card) => card.kac_id.toString() === draggableId)
      updatedCard.kat_id = destination.droppableId
    
      const updatedCardData = {
        kat_id: updatedCard.kat_id,
        kac_id: updatedCard.kac_id,
      }
    
      /*axios
        .patch('/api/kanban/card', updatedCardData)
        .catch((error) => {
          setErr(error.response.data)
        })*/
  }

  return (
    <div className="flex flex-col justify-center mt-1">
      <div className="w-full mx-auto">
        <div className="w-full flex justify-between items-center mb-4 bg-indigo-400 text-white px-4 py-2 rounded">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold">Project Name</h2>
            
          </div>
          <button className="bg-blue-950 text-white px-4 py-2 rounded">Compartilhar</button>
        </div>

        <div className="kanban">
          <DragDropContext onDragEnd={handleDragEnd}>
            {kanbanTable &&
              kanbanTable.map((table) => (
                <div key={table.kat_id}>
                  <ColumnList
                    keys={table.kat_id}
                    nome={table.kat_title}
                    katId={table.kat_id}
                    kanbanCards={kanbanCards.filter((card) => card.kat_id === table.kat_id)}
                    type="card"
                  />
                </div>
              ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default RenderKanban
