import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Card, TextInput, Textarea, FormLabel, Button, Icon  } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import { v4 as uuidv4 } from 'uuid';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
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
      ]
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

  const handleReorder = ({oldIndex, newIndex}) => {
    const newList = listItems.listArr.slice()
    const orderedList = arrayMoveImmutable(newList, oldIndex, newIndex)
    setListItems( prevState => (
      {
        ...prevState,
        listArr: orderedList
      }
    ))
    sdk.field.setValue(listItems)
  }

//===============================================================/
//  SORTABLE COMPONENTS
//===============================================================/

  const SortableItem = SortableElement(({data}) => {
    return (
      <li
        key={data.id}
        id={data.id}
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
              value={data.header}
              onBlur={handleChange}
              data-list-id={data.id}
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
              value={data.content}
              onBlur={handleChange}
              data-list-id={data.id}
              rows={2}
              className="list-item-input"
            />
          </div>
          <div className="list-item list-item-btn-remove" >
            <Button
              buttonType="negative"
              size="small"
              icon="HorizontalRule"
              data-list-id={data.id}
              onClick={handleDeleteItem}
              className="btn-remove" 
            ></Button>
          </div>
        </Card>
      </li>
    )
  })

  const SortableList = SortableContainer(() => {
    return (
      <ul
        className="list"
        key="main"
      >
        {listItems.listArr.map( (item, i) => ( 
          <SortableItem
            data={item}
            key={item.id}
            index={i}
          />
        ))}
      </ul>
    )
  })

//===============================================================/
//  RENDERED COMPONENT
//===============================================================/

  return (
    <>
      <SortableList
        onSortEnd={handleReorder}
        lockAxis="y"
        distance={15}
        key="main"
      />
      <div className="list-item-btn-add" >
        <Button
          buttonType="positive"
          size="small"
          icon="Plus"
          onClick={handleAddItem}
        >add row</Button>
      </div>
    </>
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
