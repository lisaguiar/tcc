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
                className="item-container"
                onClick={() => {
                setModalState("cartão", "update", card)
                }}
            >
                <p>{card.kac_title}</p>
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
          <div className="column-container justify-between p-2">
            <h4>{nome}</h4>
            <div className="flex flex=wrap">
              {/* ... */}
            </div>
          </div>
          <div className="itens-container">
            {kanbanCards &&
              kanbanCards.map((card, index) => (
                <Card
                  keys={card.kac_id}
                  card={card}
                  index={index}
                  katId={katId}
                />
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
    <div className="kanban">
      <DragDropContext onDragEnd={handleDragEnd}>
        {kanbanTable &&
          kanbanTable.map((table) => (
            <ColumnList
              keys={table.kat_id}
              nome={table.kat_title}
              katId={table.kat_id}
              kanbanCards={kanbanCards.filter((card) => card.kat_id === table.kat_id)}
              type="card"
            />
          ))}
      </DragDropContext>
    </div>
  );
}

export default RenderKanban
