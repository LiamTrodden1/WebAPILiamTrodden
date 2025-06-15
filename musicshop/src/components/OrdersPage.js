/**
 * A module for the web page to execute CRUD operations on the users table
 * @module musicShop/src/components/OrdersPage
 * @author Liam Trodden
 * @see ../App.js
 * @see ../../../dbCode
 */

import React, { useState, useEffect } from 'react';

//path for orders 
const requestBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/orders'
const requestIdBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/orders/'
//get stored jwt token for requests
const authHeader = localStorage.getItem('authHeader') || '';

/**
 * function to perform CRUD operations on the orders 
 * @returns {JSX.element} - The UI with inputs for the body of requests and ID's and a button for each CRUD operation to perform the action 
 */

const OrdersPage = () => {
    //getall
  const [orders, setOrders] = useState([]);
  //getbyid
  const [getOrders, setGetOrders] = useState('');
  const [getIdOrders, setGetIdOrders] = useState(null);
  //post
  const [createProductID, setCreateProductID] = useState('');
  const [createUserID, setCreateUserID] = useState('');
  const [createPaymentID, setCreatePaymentID] = useState('');
  const [createOrderStatus, setCreateOrderStatus] = useState('');  
  const [createOrderDate, setCreateOrderDate] = useState('');
  const [createPostcode, setCreatePostcode] = useState('');
  const [createQuantity, setCreateQuantity] = useState('');
  //put
  const [updateOrderStatus, setUpdateOrderStatus] = useState('');  
  const [updateId, setUpdateId] = useState('');

  //jwtToken
  const token = localStorage.getItem('jwtToken');

  /** 
   * When the web page is opened, check if token exists to perform operations and alert if it doesn't exist.
   * 
   * if token exists then call the getAllOrders function
   * @function
   * @name useEffect
   * @returns {void}
   */

  //when page loads do this
  useEffect(() => {
    //check for token
    if (!token) {
      alert('Error during logging in please try again');
      return;
    }
    //get all products
    getAllOrders();  
  }, []);

  /**
   * connect button to get by ID to the function to perform the get by ID
   * 
   * If input is empty then alert that inputs empty
   * else, call getByIdOrders and clear input
   * @function
   * @name submitGetById
   * @returns {void}
   */

  //find button command
  const submitGetById = async () => {
    //if order can't be found clear previous and alert
    if (!getOrders) {
      setGetIdOrders(null);
      alert('Please enter a valid order ID');
      return;
    }

    //call function and clear input
    getByIdOrders();
    setGetIdOrders('');
  }

  /**
   * connects button for creating a order to the function that performs the operation
   * 
   * If the required inputs are empty, alert they must be filled and clear inputs
   * else, call the createOrders function
   * @function
   * @name submitCreate
   * @returns {void}
   */

  //createOrders button command
  const submitCreate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!createProductID || !createUserID || !createPaymentID || !createOrderStatus || !createOrderDate) {
      alert(' Make sure all required fileds are filled ');
      setCreateProductID('');
      setCreateUserID('');
      setCreatePaymentID('');
      setCreateOrderStatus('');
      setCreateOrderDate('');
      setCreatePostcode('');
      setCreateQuantity('');
      return;
    }

    //call function
    createOrders();
  }

  /**
   * Connects the update button the the function that performs the Update
   * 
   * if the orderID isnt input alert the ID is required and clear inputs
   * else, call the updateOrders function
   * @function
   * @name submitUpdate
   * @returns {void}
   */

  //updateProduct button command
  const submitUpdate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!updateId) {
      alert('Must provide the order ID');
      setUpdateOrderStatus('');
      setUpdateId('');
      return;
    }
    // call function
    updateOrders();
  }

  /**
   * function to make the request to GET all orders
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert orders not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting orders
   * @function
   * @name getAllOrders
   * @returns {void}
   */

  //get all orders
  const getAllOrders = async () => {
    try {
      //make response
      const response = await fetch(requestBase, {
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });
      
      //if response failed alert
      if (!response.ok) {
        alert('Orders Not Found')
        return;
      }
      
      //succesful response show data
      const data = await response.json();
      setOrders(data);
    }
    catch (error) {
      console.error('Error getting orders', error);
    }
  };

  /**
   * function to make the request to GET an order
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert order not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting order
   * @function
   * @name getByIdOrders
   * @returns {void}
   */

  // get a specific order
  const getByIdOrders = async () => {
    try {
      //make response
      const response = await fetch(`${requestIdBase}${getOrders}`, {
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });

      //if response failed alert and clear input
      if (!response.ok) {
        alert('Order Not Found')
        setGetOrders('');
        return;
      }
      
      //if success show order and clear input
      const data = await response.json();
      setGetIdOrders(data);
      setGetOrders('');
    }
    catch (error) {
      console.error('Error getting order', error);
    }
  }

  /**
   * async function to make the POST request to create an Order
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully created the order and clear inputs and refresh all the orders
   * catch error creating the order
   * @function
   * @name createOrders
   * @returns {void}
   */

  //create a order
  const createOrders = async () => {
    try{

      //fill the body with data and stringify for valid format
      const body = {
        productID: createProductID, 
        userID: createUserID,
        paymentID: createPaymentID,
        orderStatus: createOrderStatus,
        orderDate: createOrderDate,
        postcode: createPostcode,
        quantity: createQuantity,
      };
      const newBody = JSON.stringify(body)

      //make response
      const response = await fetch(requestBase, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
        body : newBody,
      });

      //if failed alert and clear inputs
      if (!response.ok) {
        alert("Order Creation Failed")
        setCreateProductID('');
        setCreateUserID('');
        setCreatePaymentID('');
        setCreateOrderStatus('');
        setCreateOrderDate('');
        setCreatePostcode('');
        setCreateQuantity('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("Order Succesfully Created")
      setCreateProductID('');
      setCreateUserID('');
      setCreatePaymentID('');
      setCreateOrderStatus('');
      setCreateOrderDate('');
      setCreatePostcode('');
      setCreateQuantity('');
      getAllOrders();
    }
    catch (error) {
      console.error('Error creating order:', error);
    }
  }

  /**
   * async function to make the PUT request to update an Order
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully updated the order and clear inputs and refresh all the orders
   * catch error updating the order
   * @function
   * @name updateOrders
   * @returns {void}
   */

  const updateOrders = async () => {
    try {
      //fill the body with data and stringify for valid format
      let body = {
        orderStatus: updateOrderStatus,
      };
      const newBody = JSON.stringify(body);

      //make response
      const response = await fetch(`${requestIdBase}${updateId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
        body : newBody,
      });

      //if failed alert and clear inputs
      if (!response.ok) {
        alert("Updating Order Failed")
        setUpdateOrderStatus('');
        setUpdateId('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("Order Succesfully Updated")
      setUpdateOrderStatus('');
      setUpdateId('');
      getAllOrders();
    }
    catch (error) {
      console.error('Error updating order:', error);
    }
  }



  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}>


      {/* getById */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'lightgrey'
      }}>
        <h2> Find Order By ID </h2>
        <input 
          type="text"
          value={getOrders}
          onChange={(e) => setGetOrders(e.target.value)}
          placeholder="Search Orders"
        />

        <button onClick={submitGetById}>Find</button>

        {getIdOrders && getIdOrders.productID &&(
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3>Order Details</h3>
            <p><strong>ID:</strong> {getIdOrders.orderID}</p>
            <p><strong>ProductID:</strong> {getIdOrders.productID}</p>
            <p><strong>UserID:</strong> {getIdOrders.userID}</p>
            <p><strong>PaymentID:</strong> {getIdOrders.paymentID}</p>
            <p><strong>OrderStatus:</strong> {getIdOrders.orderStatus}</p>
            <p><strong>OrderDate:</strong> {getIdOrders.orderDate}</p>
          </div>
        )}
      </div>


      {/* Create */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
      }}>

        <h2> Create An Order </h2>
        <input 
          type="number"
          value={createProductID}
          onChange={(e) => setCreateProductID(Number(e.target.value))}
          placeholder="Enter ProductID"
        />
        <input 
          type="number"
          value={createUserID}
          onChange={(e) => setCreateUserID(Number(e.target.value))}
          placeholder="Enter UserID"
        />
        <input 
          type="number"
          value={createPaymentID}
          onChange={(e) => setCreatePaymentID(Number(e.target.value))}
          placeholder="Enter PaymentID"
        />
        <input 
          type="text"
          value={createOrderStatus}
          onChange={(e) => setCreateOrderStatus(e.target.value)}
          placeholder="Enter OrderStatus"
        />
        <input 
          type="text"
          value={createOrderDate}
          onChange={(e) => setCreateOrderDate(e.target.value)}
          placeholder="Enter OrderDate"
        />
        <input 
          type="text"
          value={createPostcode}
          onChange={(e) => setCreatePostcode(e.target.value)}
          placeholder="Enter Postcode"
        />
        <input 
          type="number"
          value={createQuantity}
          onChange={(e) => setCreateQuantity(Number(e.target.value))}
          placeholder="Enter Quantity"
        />


        <button onClick={submitCreate}>Create</button>

      </div>


      {/* Update */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
      }}>

        <h2> Update An Order </h2>
        <input 
          type="number"
          value={updateId}
          onChange={(e) => setUpdateId(Number(e.target.value))}
          placeholder="Enter PaymentID"
        />
        <input 
          type="text"
          value={updateOrderStatus}
          onChange={(e) => setUpdateOrderStatus(e.target.value)}
          placeholder="Enter OrderStatus"
        />

        <button onClick={submitUpdate}>Update</button>

      </div>


      {/* get all */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'lightgrey'
      }}>    

        <h2> Retrieved Orders </h2>
        {/* No orders found */}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          // Load all results 
          orders.map(orders => (
            <div key={orders.orderID}>
              {/* data fields to retrieve */}
              <h3>{orders.userID}</h3>
              <p><strong>ID:</strong> {orders.userID}</p>
              <p>{orders.productID}</p>
              <p>{orders.userID}</p>
              <p>{orders.paymentID}</p>
              <p>{orders.orderStatus}</p>
              <p>{orders.orderDate}</p>
              <p>{orders.postcode}</p>
              <p>{orders.quantity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default OrdersPage;