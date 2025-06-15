/**
 * A module for the login page to get the users jwt token for authorisation and credentials for a succesful log in 
 * @module musicShop/src/components/Login
 * @author Liam Trodden
 * @see ../App.js
 */

import React, { useState, useEffect } from 'react';
// changed useNaviagte to useHistory
import { useHistory } from 'react-router-dom';

//path for where to sublit get request
const authBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/login'

/**
 * function to get the users username and password for login and  to generate a jwt token on successful login
 * @returns {JSX.element} - an an entry each for username and password and a button to submit
 * @exports Login
 */
function Login(){
  //create variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  /**
   * An async function that executes upon the page opening to clear
   * any existing jwt token incase the user is swapping account
   * @function
   * @name useEffect
   * @returns {void}
   */
  // when page loads do this
  useEffect(() => {
    // clear jwt token incase of account switching
    localStorage.removeItem('jwtToken');
  }, []);

  /**
   * A function called by the button to compare the username and password in the inputs.
   * If the username or password is empty alert that the field can't be empty.
   * Send the GET request containing the username and password for submission in the basic authentication.
   * If the response is valid, get the jwt token and store in the variable token which is then locally stored,
   * alert the login was successful and navigate to dashboard.
   * Else, alert the details were incorrect and return 
   * @function
   * @name submit
   * @returns {void}
   */

  //submit button to login
  const submit = async () => {

    //check username or password aren't empty
    if (!username || !password) {
      alert('Please enter both username and password.');
    }

    // send login details in get 
    const loginDetails = btoa(`${username}:${password}`);
    const response = await fetch(authBase, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${loginDetails}`,
      },
    });

    //if details correct then store jwt token in local storage and move to products page
    if (response.ok){
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('jwtToken', token);
      alert('Successfully logged In');
      history.push('/dashboard');
    }
    // failed login
    else{
      alert('Incorrect Details');
      return;
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {/*username textbox*/}
      <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      {/*password textbox*/}
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {/*submit button*/} 
      <button onClick={submit}>Login</button>
    </div>
  );
}

/** exports  */
export default Login;