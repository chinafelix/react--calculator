import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import './index.css';
import App from './App';
import Optimization from './optimization'
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route exact path="/optimization" component={Optimization}></Route>
      </Switch>

      <ul className="nav-wrapper">
        <li>
          <Link to="/">版本一</Link>
        </li>
        <li>
          <Link to="/optimization">版本二</Link>
        </li>
      </ul>
    </div>
  </Router>,
  document.getElementById('root')
);
