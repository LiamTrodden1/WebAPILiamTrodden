/**
 * A module to handle navigation between the web pages
 * @module musicShop/src/components/Dashboard
 * @author Liam Trodden
 * @see ../App.js
 */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';


/**
 * Dashboard async functions to kove to a new web page
 * @returns {JSX.Element} - The buttons to navigate to the next web page
 * @exports Dashboard
 */
const Dashboard = () => {
  const history = useHistory(); 

  /** Connnects button to product page navigation 
   * @function
  */
  const navigateProductList = () => {
    productList();
  };
  /** navigate to /products
   * @function
   */
  const productList = () => {
    history.push('/products');
  };

  /** Connnects button to user page navigation 
   * @function
  */
  const navigateUserPage = () => {
    userPage();
  };
  /** navigate to /users */
  const userPage = () => {
    history.push('/users');
  };

  /** Connnects button to payments page navigation 
   * @function
  */
  const navigatePaymentsPage = () => {
    paymentsPage();
  };
  /** navigate to /payments 
   * @function
  */
  const paymentsPage = () => {
    history.push('/payments');
  };

  /** Connnects button to orders page navigation 
   * @function
  */
  const navigateOrdersPage = () => {
    ordersPage();
  };
  /** navigate to /orders 
   * @function
  */
  const ordersPage = () => {
    history.push('/orders');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}>
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'lightgrey'
      }}>
        {/* ProductList */}
        <button onClick={navigateProductList}>Products</button>
        {/* User Page */}
        <button onClick={navigateUserPage}>Users</button>
        {/* Payments Page */}
        <button onClick={navigatePaymentsPage}>Payments</button>
        {/* Orders Page */}
        <button onClick={navigateOrdersPage}>Orders</button>
      </div>

    </div>
  );
};

export default Dashboard;