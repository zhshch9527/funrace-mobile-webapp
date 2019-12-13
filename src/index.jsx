import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute} from 'react-router';

import App from './components/App';
import Login from './components/Login';
import Data from './pages/data/Data' ;
import './index.less';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Data} />
      <Route path="/login" component={Login} />
      <Route path="/data" component={Data} />
    </Route>
  </Router>
, document.getElementById('example'));

