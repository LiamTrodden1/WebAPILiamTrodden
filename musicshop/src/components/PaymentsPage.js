/**
 * A module for the web page to execute CRUD operations on the users table
 * @module musicShop/src/components/PaymentsPage
 * @author Liam Trodden
 * @see ../App.js
 * @see ../../../dbCode
 */

import React, { useState, useEffect } from 'react';

//path for payments 
const requestBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/payments'
const requestIdBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/payments/'
//get stored jwt token for requests
const authHeader = localStorage.getItem('authHeader') || '';

/**
 * function to perform CRUD operations on the payments
 * @returns {JSX.element} - The UI with inputs for the body of requests and ID's and a button for each CRUD operation to perform the action 
 */

const PaymentsPage = () => {
  //getall
  const [payments, setPayments] = useState([]);
  //getbyid
  const [getPayments, setGetPayments] = useState('');
  const [getIdPayments, setGetIdPayments] = useState(null);
  //post
  const [createOrderID, setCreateOrderID] = useState('');
  const [createUserID, setCreateUserID] = useState('');
  const [createCost, setCreateCost] = useState('');
  const [createPaymentStatus, setCreatePaymentStatus] = useState('');  
  const [createPaymentDate, setCreatePaymentDate] = useState('');  
  //put
  const [updatePaymentStatus, setUpdatePaymentStatus] = useState('');  
  const [updateId, setUpdateId] = useState('');

  //jwtToken
  const token = localStorage.getItem('jwtToken');

  /** 
   * When the web page is opened, check if token exists to perform operations and alert if it doesn't exist.
   * 
   * if token exists then call the getAllPayments function
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
    getAllPayments();  
  }, []);

  /**
   * connect button to get by ID to the function to perform the get by ID
   * 
   * If input is empty then alert that inputs empty
   * else, call getByIdPayments and clear input
   * @function
   * @name submitGetById
   * @returns {void}
   */

  //find button command
  const submitGetById = async () => {
    //if payment can't be found clear previous and alert
    if (!getPayments) {
      setGetIdPayments(null);
      alert('Please enter a valid payment ID');
      return;
    }

    //call function and clear input
    getByIdPayments();
    setGetIdPayments('');
  }

  /**
   * connects button for creating a payment to the function that performs the operation
   * 
   * If the required inputs are empty, alert they must be filled and clear inputs
   * else, call the createPayments function
   * @function
   * @name submitCreate
   * @returns {void}
   */

  //createPayments button command
  const submitCreate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!createOrderID || !createUserID || !createCost || !createPaymentStatus || !createPaymentDate) {
      alert(' Make sure all required fileds are filled ');
      setCreateOrderID('');
      setCreateUserID('');
      setCreateCost('');
      setCreatePaymentStatus('');
      setCreatePaymentDate('');
      return;
    }

    //call function
    createPayments();
  }

  /**
   * Connects the update button the the function that performs the Update
   * 
   * if the paymentID isnt input alert the ID is required and clear inputs
   * else, call the updatePayments function
   * @function
   * @name submitUpdate
   * @returns {void}
   */

  //updateProduct button command
  const submitUpdate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!updateId) {
      alert('Must provide the payment ID');
      setUpdatePaymentStatus('');
      setUpdateId('');
      return;
    }
    // call function
    updatePayments();
  }

  /**
   * function to make the request to GET all payments
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert payments not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting payments
   * @function
   * @name getAllPayments
   * @returns {void}
   */

  //get all payments
  const getAllPayments = async () => {
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
        alert('Payments Not Found')
        return;
      }
      
      //succesful response show data
      const data = await response.json();
      setPayments(data);
    }
    catch (error) {
      console.error('Error getting payments', error);
    }
  };

  /**
   * function to make the request to GET a payment
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert order not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting payment
   * @function
   * @name getByIdPayments
   * @returns {void}
   */

  // get a specific payment
  const getByIdPayments = async () => {
    try {
      //make response
      const response = await fetch(`${requestIdBase}${getPayments}`, {
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });

      //if response failed alert and clear input
      if (!response.ok) {
        alert('Payment Not Found')
        setGetPayments('');
        return;
      }
      
      //if success show payment and clear input
      const data = await response.json();
      setGetIdPayments(data);
      setGetPayments('');
    }
    catch (error) {
      console.error('Error getting payment', error);
    }
  }

  /**
   * async function to make the POST request to create a Payment
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully created the payment and clear inputs and refresh all the payments
   * catch error creating the payment
   * @function
   * @name createPayments
   * @returns {void}
   */

  //create a payment
  const createPayments = async () => {
    try{

      //fill the body with data and stringify for valid format
      const body = {
        orderID: createOrderID, 
        userID: createUserID,
        cost: createCost,
        paymentStatus: createPaymentStatus,
        paymentDate: createPaymentDate,
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
        alert("Payment Creation Failed")
        setCreateOrderID('');
        setCreateUserID('');
        setCreateCost('');
        setCreatePaymentStatus('');
        setCreatePaymentDate('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("Payment Succesfully Created")
      setCreateOrderID('');
      setCreateUserID('');
      setCreateCost('');
      setCreatePaymentStatus('');
      setCreatePaymentDate('');
      getAllPayments();
    }
    catch (error) {
      console.error('Error creating payment:', error);
    }
  }

  /**
   * async function to make the PUT request to update an Payment
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully updated the payment and clear inputs and refresh all the payments
   * catch error updating the payment
   * @function
   * @name updatePayments
   * @returns {void}
   */

  const updatePayments = async () => {
    try {
      //fill the body with data and stringify for valid format
      let body = {
        paymentStatus: updatePaymentStatus,
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
        alert("Updating Payment Failed")
        setUpdatePaymentStatus('');
        setUpdateId('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("Payment Succesfully Updated")
      setUpdatePaymentStatus('');
      setUpdateId('');
      getAllPayments();
    }
    catch (error) {
      console.error('Error updating payment:', error);
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
        <h2> Find Payment By ID </h2>
        <input 
          type="text"
          value={getPayments}
          onChange={(e) => setGetPayments(e.target.value)}
          placeholder="Search Payments"
        />

        <button onClick={submitGetById}>Find</button>

        {getIdPayments && getIdPayments.paymentID &&(
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3>Payment Details</h3>
            <p><strong>ID:</strong> {getIdPayments.paymentID}</p>
            <p><strong>OrderID:</strong> {getIdPayments.orderID}</p>
            <p><strong>UserID:</strong> {getIdPayments.userID}</p>
            <p><strong>Cost:</strong> {getIdPayments.cost}</p>
            <p><strong>PaymentStatus:</strong> {getIdPayments.paymentStatus}</p>
            <p><strong>PaymentDate:</strong> {getIdPayments.paymentDate}</p>
          </div>
        )}
      </div>


      {/* Create */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
      }}>

        <h2> Create A Payment </h2>
        <input 
          type="number"
          value={createOrderID}
          onChange={(e) => setCreateOrderID(Number(e.target.value))}
          placeholder="Enter OrderID"
        />
        <input 
          type="number"
          value={createUserID}
          onChange={(e) => setCreateUserID(Number(e.target.value))}
          placeholder="Enter UserID"
        />
        <input 
          type="number"
          value={createCost}
          onChange={(e) => setCreateCost(Number(e.target.value))}
          placeholder="Enter Cost"
        />
        <input 
          type="text"
          value={createPaymentStatus}
          onChange={(e) => setCreatePaymentStatus(e.target.value)}
          placeholder="Enter PaymentStatus"
        />
        <input 
          type="text"
          value={createPaymentDate}
          onChange={(e) => setCreatePaymentDate(e.target.value)}
          placeholder="Enter PaymentDate"
        />

        <button onClick={submitCreate}>Create</button>

      </div>


      {/* Update */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
      }}>

        <h2> Update A Payment </h2>
        <input 
          type="number"
          value={updateId}
          onChange={(e) => setUpdateId(Number(e.target.value))}
          placeholder="Enter PaymentID"
        />
        <input 
          type="text"
          value={updatePaymentStatus}
          onChange={(e) => setUpdatePaymentStatus(e.target.value)}
          placeholder="Enter PaymentStatus"
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

        <h2> Retrieved Payments </h2>
        {/* No payments found */}
        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          // Load all results 
          payments.map(payments => (
            <div key={payments.paymentID}>
              {/* data fields to retrieve */}
              <h3>{payments.userID}</h3>
              <p><strong>ID:</strong> {payments.userID}</p>
              <p>{payments.orderID}</p>
              <p>{payments.userID}</p>
              <p>{payments.cost}</p>
              <p>{payments.paymentStatus}</p>
              <p>{payments.paymentDate}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PaymentsPage;