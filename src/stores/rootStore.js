import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

export default function configureStore(initialState = {}) {
  const middleware = [thunk, logger];

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );

  return store;
}
