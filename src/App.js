import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'ITEM';

const DraggableItem = ({ id, text, status, index, moveItem, updateItemStatus, removeItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ padding: '8px', border: '1px solid #ddd', marginBottom: '4px' }}>
      <div>{text}</div>
      <div>
        {status === 'todo' && (
          <button onClick={() => updateItemStatus(id, 'done')} style={{ marginRight: '8px' }}>
            Przenieś do zrobionych
          </button>
        )}
        <button onClick={() => removeItem(id)}>Usun</button>
      </div>
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Przyklad 1', status: 'todo' },
    { id: 2, text: 'Przyklad 2', status: 'todo' },
    { id: 3, text: 'Przyklad 3', status: 'done' },
  ]);

  const addItem = (text) => {
    const newItem = {
      id: new Date().getTime(),
      text,
      status: 'todo',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  const updateItemStatus = (id, newStatus) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setItems(updatedItems);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Lista zadan</h1>
      <div>
        <input type="text" id="newItem" placeholder="Wprowadz now zadanie" />
        <button onClick={() => addItem(document.getElementById('newItem').value)}>Dodaj</button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <h2>To-Do</h2>
            {items
              .filter((item) => item.status === 'todo')
              .map((item, index) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  status={item.status}
                  index={index}
                  moveItem={moveItem}
                  updateItemStatus={updateItemStatus}
                  removeItem={removeItem}
                />
              ))}
          </div>
          <div style={{ flex: 1 }}>
            <h2>Done</h2>
            {items
              .filter((item) => item.status === 'done')
              .map((item, index) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  status={item.status}
                  index={index}
                  moveItem={moveItem}
                  updateItemStatus={updateItemStatus}
                  removeItem={removeItem}
                />
              ))}
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default App;
