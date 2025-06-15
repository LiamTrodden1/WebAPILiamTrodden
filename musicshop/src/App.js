/**
 * A module handle routes for the application
 * @module musicShop/src/app
 * @author Liam Trodden
 */

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/Login';
import ProductList from './components/ProductList';
import Dashboard from './components/Dashboard';
import UserPage from './components/UserPage';
import PaymentsPage from './components/PaymentsPage';
import OrdersPage from './components/OrdersPage';

/**
 * function containing all the routes for the different web pages
 */

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" children={<Login />} exact />
        <Route path="/dashboard" children={<Dashboard />} />
        <Route path="/products" children={<ProductList />} />
        <Route path="/users" children={<UserPage />} />
        <Route path="/payments" children={<PaymentsPage />} />
        <Route path="/orders" children={<OrdersPage />} />
      </Switch>
    </Router> 
  );
};

/** Export the app component */
export default App;
