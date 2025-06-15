/**
 * A module for the web page to execute CRUD operations on the users table
 * @module musicShop/src/components/UserPage
 * @author Liam Trodden
 * @see ../App.js
 * @see ../../../dbCode
 */

import React, { useState, useEffect } from 'react';

//path for users 
const requestBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/users'
const requestIdBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/users/'
//get stored jwt token for requests
const authHeader = localStorage.getItem('authHeader') || '';

/**
 * function to perform CRUD operations on the users 
 * @returns {JSX.element} - The UI with inputs for the body of requests and ID's and a button for each CRUD operation to perform the action 
 */

const UserPage = () => {
  //getall
  const [users, setUsers] = useState([]);
  //getbyid
  const [getUsers, setGetUsers] = useState('');
  const [getIdUsers, setGetIdUsers] = useState(null);
  //post
  const [createUsername, setCreateUsername] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState('');  
  //put
  const [updateUsername, setUpdateUsername] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [updateRole, setUpdateRole] = useState('');  
  const [updateId, setUpdateId] = useState('');
  //delete
  const [delUsers, setDelUsers] = useState('')
  const [deleteIdUsers, setDeleteIdUsers] = useState(null);

  //jwtToken
  const token = localStorage.getItem('jwtToken');

  /** 
   * When the web page is opened, check if token exists to perform operations and alert if it doesn't exist.
   * 
   * if token exists then call the getAllUsers function
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
    getAllUsers();  
  }, []);

  /**
   * connect button to get by ID to the function to perform the get by ID
   * 
   * If input is empty then alert that inputs empty
   * else, call getByIdUsers and clear input
   * 
   * @function
   * @name submitGetById
   * @returns {void}
   */

  //find button command
  const submitGetById = async () => {
    //if user can't be found clear previous and alert
    if (!getUsers) {
      setGetIdUsers(null);
      alert('Please enter a valid user ID');
      return;
    }

    //call function and clear input
    getByIdUsers();
    setGetIdUsers('');
  }

  /**
   * connects button for creating a user to the function that performs the operation
   * 
   * If the required inputs are empty, alert they must be filled and clear inputs
   * else, call the createUsers function
   * @function
   * @name submitCreate
   * @returns {void}
   */

  //createUsers button command
  const submitCreate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!createUsername || !createEmail || !createPassword || !createRole) {
      alert(' Make sure all required fileds are filled ');
      setCreateUsername('');
      setCreateEmail('');
      setCreatePassword('');
      setCreateRole('');
      return;
    }

    //call function
    createUsers();
  }

  /**
   * Connects the update button the the function that performs the Update
   * 
   * if the userID isnt input alert the ID is required and clear inputs
   * else, call the updateUsers function
   * @function
   * @name submitUpdate
   * @returns {void}
   */

  //updateProduct button command
  const submitUpdate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!updateId) {
      alert('Must provide the user ID');
      setUpdateUsername('');
      setUpdateEmail('');
      setUpdatePassword('');
      setUpdateRole('');
      setUpdateId('');
      return;
    }
    // call function
    updateUsers();
  }

  /**
   * function to connect the delete button to the function that deletes the User
   * 
   * id the input is empty alert the userID must be present and clear input
   * else, call the deleteUsers function
   * @function
   * @name submitDelete
   * @returns {void}
   */

  const submitDelete = async () => {
    //if user can't be found clear previous
    if (!delUsers) {
      setDelUsers('');
      alert('Please enter a valid user ID');
      return;
    }
    //call function
    deleteUsers();
  }

  /**
   * function to make the request to GET all users
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert users not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting users
   * @function
   * @name getAllUsers
   * @returns {void}
   */

  //get all users
  const getAllUsers = async () => {
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
        alert('Users Not Found')
        return;
      }
      
      //succesful response show data
      const data = await response.json();
      setUsers(data);
    }
    catch (error) {
      console.error('Error getting users', error);
    }
  };

  /**
   * function to make the request to GET a user
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert user not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting user
   * @function
   * @name getByIdUsers
   * @returns {void}
   */

  // get a specific user
  const getByIdUsers = async () => {
    try {
      //make response
      const response = await fetch(`${requestIdBase}${getUsers}`, {
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });

      //if response failed alert and clear input
      if (!response.ok) {
        alert('User Not Found')
        setGetUsers('');
        return;
      }
      
      //if success show user and clear input
      const data = await response.json();
      setGetIdUsers(data);
      setGetUsers('');
    }
    catch (error) {
      console.error('Error getting user', error);
    }
  }

  /**
   * async function to make the POST request to create a User
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully created the user and clear inputs and refresh all the users
   * catch error creating the user
   * @function
   * @name createUsers
   * @returns {void}
   */

  //createUsers a user
  const createUsers = async () => {
    try{

      //fill the body with data and stringify for valid format
      const body = {
        username: createUsername, 
        email: createEmail,
        password: createPassword,
        role: createRole,
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
        alert("User Creation Failed")
        setCreateUsername('');
        setCreateEmail('');
        setCreatePassword('');
        setCreateRole('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("User Succesfully Created")
      setCreateUsername('');
      setCreateEmail('');
      setCreatePassword('');
      setCreateRole('');
      getAllUsers();
    }
    catch (error) {
      console.error('Error creating user:', error);
    }
  }

  /**
   * async function to make the PUT request to update a User
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully updated the user and clear inputs and refresh all the users
   * catch error updating the user
   * @function
   * @name updateUsers
   * @returns {void}
   */

  const updateUsers = async () => {
    try {
      //fill the body with data and stringify for valid format
      let body = {
        username: updateUsername, 
        email: updateEmail,
        password: updatePassword,
        role: updateRole,
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
        alert("Updating User Failed")
        setUpdateUsername('');
        setUpdateEmail('');
        setUpdatePassword('');
        setUpdateRole('');
        setUpdateId('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("User Succesfully Updated")
      setUpdateUsername('');
      setUpdateEmail('');
      setUpdatePassword('');
      setUpdateRole('');
      setUpdateId('');
      getAllUsers();
    }
    catch (error) {
      console.error('Error updating user:', error);
    }
  }

  /**
   * function to make the request to DELETE a user
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert user not found so can the deleted and clear input
   * else, alert the deletion as successful, clear the input and refresh all users
   * catch an error deleting user
   * @function
   * @name deleteUsers
   * @returns {void}
   */  

  const deleteUsers = async () => {
    try {
      //make response
      const response = await fetch(`${requestIdBase}${delUsers}`, {
        method: 'DELETE',
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });

      //if response failed alert and clear input
      if (!response.ok) {
        alert('Users cannot be deleted')
        setDelUsers('');
        return;
      }
      
      //if success delete user and clear input
      alert('Successfully Deleted')
      setDelUsers('');
      getAllUsers();
    }
    catch (error) {
      console.error('Error deleting user:', error);
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
        <h2> Find User By ID </h2>
        <input 
          type="text"
          value={getUsers}
          onChange={(e) => setGetUsers(e.target.value)}
          placeholder="Search Users"
        />

        <button onClick={submitGetById}>Find</button>

        {getIdUsers && getIdUsers.userID &&(
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3>User Details</h3>
            <p><strong>ID:</strong> {getIdUsers.userID}</p>
            <p><strong>Name:</strong> {getIdUsers.username}</p>
            <p><strong>Track Length:</strong> {getIdUsers.email}</p>
            <p><strong>Price:</strong> {getIdUsers.password}</p>
            <p><strong>Formats:</strong> {getIdUsers.role}</p>
          </div>
        )}
      </div>


      {/* Create */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
      }}>

        <h2> Create A User </h2>
        <input 
          type="text"
          value={createUsername}
          onChange={(e) => setCreateUsername(e.target.value)}
          placeholder="Enter Username"
        />
        <input 
          type="text"
          value={createEmail}
          onChange={(e) => setCreateEmail(e.target.value)}
          placeholder="Enter Email Address"
        />
        <input 
          type="text"
          value={createPassword}
          onChange={(e) => setCreatePassword(e.target.value)}
          placeholder="Enter Password"
        />
        <input 
          type="text"
          value={createRole}
          onChange={(e) => setCreateRole(e.target.value)}
          placeholder="Enter Role"
        />

        <button onClick={submitCreate}>Create</button>

      </div>


      {/* Update */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
      }}>

        <h2> Update A Users </h2>
        <input 
          type="text"
          value={updateId}
          onChange={(e) => setUpdateId(e.target.value)}
          placeholder="Enter Products ID"
        />
        <input 
          type="text"
          value={updateUsername}
          onChange={(e) => setUpdateUsername(e.target.value)}
          placeholder="Enter Username"
        />
        <input 
          type="text"
          value={updateEmail}
          onChange={(e) => setUpdateEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input 
          type="text"
          value={updatePassword}
          onChange={(e) => setUpdatePassword(e.target.value)}
          placeholder="Enter Password"
        />
        <input 
          type="text"
          value={updateRole}
          onChange={(e) => setUpdateRole(e.target.value)}
          placeholder="Enter Role"
        />

        <button onClick={submitUpdate}>Update</button>

      </div>


      {/* delete */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
      }}>
        <h2> Delete user By ID </h2>
        <input 
          type="text"
          value={delUsers}
          onChange={(e) => setDelUsers(e.target.value)}
          placeholder="Delete Products"
        />

        <button onClick={submitDelete}>Delete</button>

        {/* Display Selected Users */}
        {deleteIdUsers && deleteIdUsers.productID &&(
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3>Users Details</h3>
            <p><strong>ID:</strong> {deleteIdUsers.productID}</p>
            <p><strong>Name:</strong> {deleteIdUsers.username}</p>
            <p><strong>Track Length:</strong> {deleteIdUsers.email}</p>
            <p><strong>Price:</strong> {deleteIdUsers.password}</p>
            <p><strong>Formats:</strong> {deleteIdUsers.role}</p>
          </div>
        )}
      </div>


      {/* get all */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: 'lightgrey'
      }}>    

        <h2> Retrieved Users </h2>
        {/* No users found */}
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          // Load all results 
          users.map(users => (
            <div key={users.userID}>
              {/* data fields to retrieve */}
              <h3>{users.userID}</h3>
              <p><strong>ID:</strong> {users.userID}</p>
              <p>{users.username}</p>
              <p>{users.email}</p>
              <p>{users.password}</p>
              <p>{users.role}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserPage;