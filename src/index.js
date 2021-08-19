import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Card, TextInput } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({sdk}) => {

  const [ listItems, setListItems ] = useState( sdk.field.getValue() ||
    {
      listArr: [
        {
          header: "header1", content: "content1"
        }
      ],
      dragging: false
    }
  )

  const onExternalChange = value => {
    setListItems(value);
  }

  const handleChange = (e) => {
    const target = e.target
    const targetIndex = target.dataset.index

    const newList = listItems.listArr.slice()
    if (target.name === "header") { newList[targetIndex] = {
        header: target.value,
        content: newList[targetIndex].content
      }
    } else if (target.name === "content") {
      newList[targetIndex] = {
        header: newList[targetIndex].header,
        content: target.value
      }
    }
    console.log(newList)
    setListItems({listArr: newList})
    sdk.field.setValue(listItems)
  }

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detatchValueChangeHandler;
  });

  return (
    <>
      { listItems.listArr.map( (item, i) => (
        <Card
          key={i}
        >
          <TextInput
            type="text"
            name="header"
            value={item.header}
            onChange={handleChange}
            data-index={i}
          />
          <TextInput
            type="text"
            name="content"
            value={item.content}
            onChange={handleChange}
            data-index={i}
          />
        </Card>
      ))}
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
