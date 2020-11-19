import React from 'react';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import AppRouter from './routers/AppRouter';
import configureStore from './stores/rootStore';
import './App.css';

const jsx = () => (
  <CookiesProvider>
    <Provider store={configureStore()}>
      <AppRouter />
    </Provider>
  </CookiesProvider>
);

export default jsx;
