import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Form, Card, TextInput, Textarea, FormLabel, Button, Icon } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { arrayMoveImmutable } from 'array-move';
import { v4 as uuidv4 } from 'uuid';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({sdk}) => {

//===============================================================/
//  CONTENT STATE
//===============================================================/

  const [ listItems, setListItems ] = useState( sdk.field.getValue() ||
    {
      listArr: [
        {
          id: uuidv4(),
          header: "",
          content: ""
        }
      ],
      dragging: false
    }
  )

//===============================================================/
//  CONTENT HANDLERS
//===============================================================/

  // const onExternalChange = value => {
  //   setListItems(value);
  // }

  const handleChange = (e) => {
    const target = e.target
    const listId = target.dataset.listId
    const newList = listItems.listArr.slice()
    for (let item of newList) {
      if (listId === item.id ) {
        target.name === "header" && (item.header = target.value)
        target.name === "content" && (item.content = target.value)
      }
    }
    setListItems( prevState => (
      {
        ...prevState,
        listArr: newList
      }
    ))
    sdk.field.setValue(listItems)
  }

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  // useEffect(() => {
  //   // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
  //   const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
  //   return detatchValueChangeHandler;
  // });

//===============================================================/
//  CARD HANDLERS
//===============================================================/

  const handleAddItem = () => {
    setListItems( prevState => (
      {
        ...prevState,
        listArr: [
          ...prevState.listArr,
          {
            id: uuidv4(),
            header: "",
            content: ""
          }
        ]
      }
    ))
    sdk.field.setValue(listItems)
  }

  const handleDeleteItem = (e) => {
    const target = e.target
    const listId = target.closest(".btn-remove").dataset.listId
    const newList = listItems.listArr.slice()
    for (let [index, item] of newList.entries()) {
      listId === item.id && (newList.splice(index, 1))
    }
    setListItems( prevState => (
      {
        ...prevState,
        listArr: newList
      }
    ))
    sdk.field.setValue(listItems)
  }

  const onDragEnd = (result) => {
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    const oldList = listItems.listArr.slice()
    const newList = arrayMoveImmutable(oldList, sourceIndex, destinationIndex)
    setListItems( prevState => (
      {
        ...prevState,
        listArr: newList
      }
    ))
    sdk.field.setValue(listItems)
  }

//===============================================================/
//  SORTABLE COMPONENTS
//===============================================================/

  const SortableItem = (item, i) => {
    return (
      <Draggable draggableId={item.id} index={i} key={item.id}>
        {(provided) => (
          <li
            key={item.id}
            id={item.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card
              className="list-item-wrapper"
            >
              <div className="drag-icon">
                <Icon icon="Drag" />
              </div>
              <div className="list-item list-item-header" >
                <FormLabel
                  htmlFor="header"
                  className="list-item-title"
                >Heading</FormLabel>
                <TextInput
                  type="text"
                  name="header"
                  value={item.header}
                  onChange={handleChange}
                  data-list-id={item.id}
                  className="list-item-input"
                />
              </div>
              <div className="list-item list-item-content" >
                <FormLabel
                  htmlFor="content"
                  className="list-item-title"
                >Content</FormLabel>
                <Textarea
                  type="text"
                  name="content"
                  value={item.content}
                  onChange={handleChange}
                  data-list-id={item.id}
                  rows={2}
                  className="list-item-input"
                />
              </div>
              <div className="list-item list-item-btn-remove" >
                <Button
                  buttonType="negative"
                  size="small"
                  icon="HorizontalRule"
                  data-list-id={item.id}
                  onClick={handleDeleteItem}
                  className="btn-remove" 
                ></Button>
              </div>
            </Card>
          </li>
        )}
      </Draggable>
    )
  }

//===============================================================/
//  RENDERED COMPONENT
//===============================================================/

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="list-block-droppable">
        {(provided) => (
          <ul
            className="list"
            ref={provided.innerRef}
            { ...provided.droppableProps}
          >
            {listItems.listArr.map( (item, i) => ( SortableItem(item, i) ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <div className="list-item-btn-add" >
        <Button
          buttonType="positive"
          size="small"
          icon="Plus"
          onClick={handleAddItem}
        >add row</Button>
      </div>
    </DragDropContext>
  )
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
