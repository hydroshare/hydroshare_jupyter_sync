import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';

import { ConnectedRouter } from 'connected-react-router';
import {
  Route,
  Switch,
} from 'react-router';
import store, { history } from './store';

import Header from './components/Header';
import MainPage from './pages/MainPage';
import NotificationBanner from "./components/NotificationBanner";
import ResourcePage from './pages/ResourcePage';


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Header />
      <NotificationBanner/>
      <Switch>
        <Route exact={true} path="/">
          <MainPage />
        </Route>
        <Route path="/resources/:resourceId">
          <ResourcePage />
        </Route>
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
