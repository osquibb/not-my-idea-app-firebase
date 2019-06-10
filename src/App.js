import React, { Component } from 'react';
import Main from './components/MainComponent';
import './App.css';
import { Provider } from 'react-redux';
import { configureStore } from './redux/configureStore';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Main />
        </div>
      </Provider>
    );
  }
}

export default App;
