/**
 * A module for the web page to execute CRUD operations on the products table
 * @module musicShop/src/components/ProductList
 * @author Liam Trodden
 * @see ../App.js
 * @see ../../../dbCode
 */

import React, {useEffect, useState} from 'react';

//path for products 
const requestBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/products'
const requestIdBase = 'https://anitamodem-vivasincere-3001.codio-box.uk/api/v1/products/'
//get stored jwt token for requests
const authHeader = localStorage.getItem('authHeader') || '';

/**
 * function to perform CRUD operations on the products 
 * @returns {JSX.element} - The UI with inputs for the body of requests and ID's and a button for each CRUD operation to perform the action 
 */

const ProductList = () => {
  //getall
  const [products, setProducts] = useState([]);
  //getbyid
  const [getProduct, setGetProduct] = useState('');
  const [getIdProduct, setGetIdProduct] = useState(null);
  //post
  const [createName, setCreateName] = useState('');
  const [createTrackLength, setCreateTrackLength] = useState();
  const [createPrice, setCreatePrice] = useState();
  const [createFormats, setCreateFormats] = useState('');  
  const [createColour, setCreateColour] = useState('');
  //put
  const [updateName, setUpdateName] = useState('');
  const [updateTrackLength, setUpdateTrackLength] = useState();
  const [updatePrice, setUpdatePrice] = useState();
  const [updateFormats, setUpdateFormats] = useState('');  
  const [updateColour, setUpdateColour] = useState('');
  const [updateId, setUpdateId] = useState();
  //delete
  const [delProduct, setDelProduct] = useState('')
  const [deleteIdProduct, setDeleteIdProduct] = useState(null);

  //jwtToken
  const token = localStorage.getItem('jwtToken');
  
  /** 
   * When the web page is opened, check if token exists to perform operations and alert if it doesn't exist.
   * 
   * if token exists then call the getAllProduct function
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
    getAllProduct();  
  }, []);

  /**
   * connect button to get by ID to the function to perform the get by ID
   * 
   * If input is empty then alert that inputs empty
   * else, call getByIdProducts and clear input
   * @function
   * @name submitGetById
   * @returns {void}
   */

  //find button command
  const submitGetById = async () => {
    //if product can't be found clear previous and alert
    if (!getProduct) {
      setGetIdProduct(null);
      alert('Please enter a valid product ID');
      return;
    }

    //call function and clear input
    getByIdProduct();
    setGetIdProduct('');
  }

  /**
   * connects button for creating a product to the function that performs the operation
   * 
   * If the required inputs are empty, alert they must be filled and clear inputs
   * else, call the createProducts function
   * @function
   * @name submitCreate
   * @returns {void}
   */

  //createProduct button command
  const submitCreate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!createName || !createTrackLength || !createPrice || !createFormats) {
      alert(' Make sure all required fileds are filled ');
      setCreateName('');
      setCreateTrackLength('');
      setCreatePrice('');
      setCreateFormats('');
      setCreateColour('');
      return;
    }

    //call function
    createProduct();
  }

  /**
   * Connects the update button the the function that performs the Update
   * 
   * if the productID isnt input alert the ID is required and clear inputs
   * else, call the updateProducts function
   * @function
   * @name submitUpdate
   * @returns {void}
   */

  //updateProduct button command
  const submitUpdate = async () => {
    //check there isn't an empty field thats mandatory, alert and clear if true
    if (!updateId) {
      alert('Must provide the product ID');
      setUpdateName('');
      setUpdateTrackLength('');
      setUpdatePrice('');
      setUpdateFormats('');
      setUpdateColour('');
      setUpdateId('');
      return;
    }
    // call function
    updateProduct();
  }

  /**
   * function to connect the delete button to the function that deletes the Product
   * 
   * id the input is empty alert the productID must be present and clear input
   * else, call the deleteProducts function
   * @function
   * @name submitDelete
   * @returns {void}
   */

  const submitDelete = async () => {
    //if product can't be found clear previous
    if (!delProduct) {
      setDelProduct('');
      alert('Please enter a valid product ID');
      return;
    }
    //call function
    deleteProduct();
  }

  /**
   * function to make the request to GET all products
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert users not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting products
   * @function
   * @name getAllProduct
   * @returns {void}
   */

  // get all products
  const getAllProduct = async () => {
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
        alert('Products Not Found')
        return;
      }
      
      //succesful response show data
      const data = await response.json();
      setProducts(data);
    }
    catch (error) {
      console.error('Error getting products', error);
    }
  };

  /**
   * function to make the request to GET a product
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert product not found and clear input
   * else, show the data retrieved in the response and clear input
   * catch an error getting product
   * @function
   * @name getByIdProduct
   * @returns {void}
   */

  // get a specific product
  const getByIdProduct = async () => {
    try {
      //make response
      const response = await fetch(`${requestIdBase}${getProduct}`, {
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });

      //if response failed alert and clear input
      if (!response.ok) {
        alert('Product Not Found')
        setGetProduct('');
        return;
      }
      
      //if success show product and clear input
      const data = await response.json();
      setGetIdProduct(data);
      setGetProduct('');
    }
    catch (error) {
      console.error('Error getting product', error);
    }
  }

  /**
   * async function to make the POST request to create a Product
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully created the product and clear inputs and refresh all the products
   * catch error creating the product
   * @function
   * @name createProduct
   * @returns {void}
   */

  //createProduct a product
  const createProduct = async () => {
    try{
      //fill the body with data and stringify for valid format
      const body = {
        name: createName, 
        trackLength: createTrackLength,
        price: createPrice,
        formats: createFormats,
        colour: createColour
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
        alert("Product Creation Failed")
        setCreateName('');
        setCreateTrackLength('');
        setCreatePrice('');
        setCreateFormats('');
        setCreateColour('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("Product Succesfully Created")
      setCreateName('');
      setCreateTrackLength('');
      setCreatePrice('');
      setCreateFormats('');
      setCreateColour('');
      getAllProduct();
    }
    catch (error) {
      console.error('Error creating product:', error);
    }
  }

  /**
   * async function to make the PUT request to update a Product
   * 
   * try and fill body with the input variables then stringify the body,
   * then create the response using the jwt token and a json format
   * if response failed alert and clear inputs
   * else alert successfully updated the product and clear inputs and refresh all the products
   * catch error updating the product
   * @function
   * @name updateProduct
   * @returns {void}
   */

  const updateProduct = async () => {
    try {
      //fill the body with data and stringify for valid format
      let body = {
        name: updateName, 
        trackLength: updateTrackLength,
        price: updatePrice,
        formats: updateFormats,
        colour: updateColour
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
        alert("Updating Product Failed")
        setUpdateName('');
        setUpdateTrackLength('');
        setUpdatePrice('');
        setUpdateFormats('');
        setUpdateColour('');
        setUpdateId('');
        return;
      }

      //if success, alert, clear inputs, and updateProduct get all products
      alert("Product Succesfully Updated")
      setUpdateName('');
      setUpdateTrackLength('');
      setUpdatePrice('');
      setUpdateFormats('');
      setUpdateColour('');
      setUpdateId('');
      getAllProduct();
    }
    catch (error) {
      console.error('Error updating product:', error);
    }
  }

  /**
   * function to make the request to DELETE a product
   * 
   * try and make the request using the jwt token as as the Authorization in json format
   * if response not ok, alert product not found so can the deleted and clear input
   * else, alert the deletion as successful, clear the input and refresh all products
   * catch an error deleting product
   * @function
   * @name deleteProduct
   * @returns {void}
   */  

  const deleteProduct = async () => {
    try {
      //make response
      const response = await fetch(`${requestIdBase}${delProduct}`, {
        method: 'DELETE',
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : `application/json`
        }
      });

      //if response failed alert and clear input
      if (!response.ok) {
        alert('Product cannot be deleted')
        setDelProduct('');
        return;
      }
      
      //if success delete product and clear input
      alert('Successfully Deleted')
      setDelProduct('');
      getAllProduct();
    }
    catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
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
        <h2> Find Product By ID </h2>
        <input 
          type="text"
          value={getProduct}
          onChange={(e) => setGetProduct(e.target.value)}
          placeholder="Search Products"
        />

        <button onClick={submitGetById}>Find</button>

        {getIdProduct && getIdProduct.productID &&(
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3>Product Details</h3>
            <p><strong>ID:</strong> {getIdProduct.productID}</p>
            <p><strong>Name:</strong> {getIdProduct.name}</p>
            <p><strong>Track Length:</strong> {getIdProduct.trackLength}</p>
            <p><strong>Price:</strong> {getIdProduct.price}</p>
            <p><strong>Formats:</strong> {getIdProduct.formats}</p>
            <p><strong>Colour:</strong> {getIdProduct.colour}</p>
          </div>
        )}
      </div>


      {/* Create */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
      }}>

        <h2> Create A Product </h2>
        <input 
          type="text"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          placeholder="Enter Name"
        />
        <input 
          type="number"
          value={createTrackLength}
          onChange={(e) => setCreateTrackLength(Number(e.target.value))}
          placeholder="Enter Track Length"
        />
        <input 
          type="number"
          value={createPrice}
          onChange={(e) => setCreatePrice(Number(e.target.value))}
          placeholder="Enter Price"
        />
        <input 
          type="text"
          value={createFormats}
          onChange={(e) => setCreateFormats(e.target.value)}
          placeholder="Enter Formats"
        />
        <input 
          type="text"
          value={createColour}
          onChange={(e) => setCreateColour(e.target.value)}
          placeholder="Enter Colour"
        />

        <button onClick={submitCreate}>Create</button>

      </div>


      {/* Update */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
      }}>

        <h2> Update A Product </h2>
        <input 
          type="text"
          value={updateId}
          onChange={(e) => setUpdateId(e.target.value)}
          placeholder="Enter Products ID"
        />
        <input 
          type="text"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
          placeholder="Enter Name"
        />
        <input 
          type="number"
          value={updateTrackLength}
          onChange={(e) => setUpdateTrackLength(Number(e.target.value))}
          placeholder="Enter Track Length"
        />
        <input 
          type="number"
          value={updatePrice}
          onChange={(e) => setUpdatePrice(Number(e.target.value))}
          placeholder="Enter Price"
        />
        <input 
          type="text"
          value={updateFormats}
          onChange={(e) => setUpdateFormats(e.target.value)}
          placeholder="Enter Formats"
        />
        <input 
          type="text"
          value={updateColour}
          onChange={(e) => setUpdateColour(e.target.value)}
          placeholder="Enter Colour"
        />

        <button onClick={submitUpdate}>Update</button>

      </div>


      {/* delete */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
      }}>
        <h2> Delete product By ID </h2>
        <input 
          type="text"
          value={delProduct}
          onChange={(e) => setDelProduct(e.target.value)}
          placeholder="Delete Products"
        />

        <button onClick={submitDelete}>Delete</button>

        {/* Display Selected Product */}
        {deleteIdProduct && deleteIdProduct.productID &&(
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
          }}>
            <h3>Product Details</h3>
            <p><strong>ID:</strong> {deleteIdProduct.productID}</p>
            <p><strong>Name:</strong> {deleteIdProduct.name}</p>
            <p><strong>Track Length:</strong> {deleteIdProduct.trackLength}</p>
            <p><strong>Price:</strong> {deleteIdProduct.price}</p>
            <p><strong>Formats:</strong> {deleteIdProduct.formats}</p>
            <p><strong>Colour:</strong> {deleteIdProduct.colour}</p>
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

        <h2> Retrieved Products </h2>
        {/* No products found */}
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          // Load all results 
          products.map(product => (
            <div key={product.productID}>
              {/* data fields to retrieve */}
              <h3>{product.productID}</h3>
              <p><strong>ID:</strong> {product.productID}</p>
              <p>{product.name}</p>
              <p>{product.trackLength}</p>
              <p>{product.price}</p>
              <p>{product.formats}</p>
              <p>{product.colour}</p>
            </div>
          ))
        )}
      </div>
  </div>
  );
};

export default ProductList;