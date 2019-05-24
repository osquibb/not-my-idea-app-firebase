import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Ideas } from './Ideas';
import { Auth } from './auth';

// Each reducer (Ideas, etc..) has it's own state 
// Example fields - isLoading: , errMessage: , ideas: , etc..
export const configureStore = () => {
  return createStore(
    combineReducers({
      ideas: Ideas,
      auth: Auth
    }),
    applyMiddleware(thunk, logger)
  ); 
}