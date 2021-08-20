import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { List, ListItem, Card, TextInput, FormLabel, Button } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({sdk}) => {

  const [ listItems, setListItems ] = useState( sdk.field.getValue() ||
    {
      listArr: [
        {
          header: "",
          content: ""
        }
      ],
      dragging: false
    }
  )

  // const onExternalChange = value => {
  //   setListItems(value);
  // }

  const handleChange = (e) => {
    const target = e.target
    const targetIndex = target.dataset.index
    const newList = listItems.listArr.slice()
    if (target.name === "header") {
      newList[targetIndex].header = target.value
    } else if (target.name === "content") {
      newList[targetIndex].content = target.value
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


  const handleAddItem = () => {
    setListItems( prevState => (
      {
        ...prevState,
        listArr: [
          ...prevState.listArr,
          {
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
    const targetIndex = target.closest(".btn-remove").dataset.index
    const newList = listItems.listArr.slice()
    for (let i = 0; i < newList.length; i++) {
      if (i == targetIndex) {
        newList.splice(targetIndex, 1)
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

  console.log(listItems)

  return (
    <>
    <List element="ol">
      { listItems.listArr.map( (item, i) => (
        <ListItem key={i}>
          <Card>
            <FormLabel htmlFor="header">Heading</FormLabel>
            <TextInput
              type="text"
              name="header"
              value={item.header}
              onChange={handleChange}
              data-index={i}
            />
            <FormLabel htmlFor="content">Content</FormLabel>
            <TextInput
              type="text"
              name="content"
              value={item.content}
              onChange={handleChange}
              data-index={i}
            />
            <Button buttonType="negative" size="small" icon="HorizontalRule" data-index={i} onClick={handleDeleteItem} className="btn-remove" ></Button>
          </Card>
        </ListItem>
      ))}
    </List>
    <Button buttonType="positive" size="small" icon="Plus" onClick={handleAddItem} ></Button>
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
