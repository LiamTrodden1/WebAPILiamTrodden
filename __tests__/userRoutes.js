const request = require('supertest')
const app = require('../app')

const tokenUser = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoidGVzdDMiLCJpYXQiOjE3NDM2MzU1OTksImV4cCI6MTc0MzYzOTE5OX0.fmiMWBMjcLZT8iMso1EDRZy9owu0-Aqw4ybX9D98Wno";
const tokenAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoidGVzdDIiLCJpYXQiOjE3NDM2MzU2MzMsImV4cCI6MTc0MzYzOTIzM30.Aki5ZIe4AYqopRw5t8463jgBgw-oyWtCgeVXTDdMrFg";

//users
//test Login
describe('successful login', () => {
  it('Should return a jwt token', async () => {
    const basic = Buffer.from("test2:Password2!").toString('base64');
    const res = await request(app.callback())
      .get('/api/v1/login')
      .set('Authorization', `Basic ${basic}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  })
})

//GET ALL
describe('User doesnt have permission to see all users', () => {
  it('should fail due to permissions being denied', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403) 
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Get all users', () => {
  it('should retrieve all users', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${tokenAdmin}`)
    expect(res.statusCode).toEqual(200)
  })
});

//GET BY ID
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the user exists', () => {
  it('Should fail due to a user not existing at that ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/100')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "User ID not found")
  })
});
describe('Check if the user has the correct permissons to get users', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/2')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permissions Denied")
  })
});
describe('retrieve a user', () => {
  it('Should return the data of the users ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/3')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(200)
  })
});

//POST
describe('cannot create the user', () => {
  it('should not create a user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'unique_112233'
      })
    expect(res.statusCode).toEqual(400)
  })
});
describe('Create a new user', () => {
  it('should create a new user', async () => {
    console.log("=========================================================================",app.callback());
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'test4',
        email: 'test4@gmail.com',
        password: 'password'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('ID', 4)
  })
});

//PUT
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the user exists', () => {
  it('Should fail due to a user not existing at that ID', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/100')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "User not found")
  })
});
describe('Check if the user has the correct permissons to update a user', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/2')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Update has been successful', () => {
  it('should update the specified user', async () => {
    console.log("=========================================================================",app.callback());
    const res = await request(app.callback())
      .put('/api/v1/users/3')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        username: 'test6',
        email: 'test6@gmail.com',
        password: 'Password6!'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', "User Updated")
  })
});

//DELETE 
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/users/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the user has the correct permissons to delete a user', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/users/2')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Successfully deleted', () => {
  it('Should delete the user', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/users/1')
      .set('Authorization', `Bearer ${tokenAdmin}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "User Deleted")
  })
});



//products
//GET ALL
describe('Get all products', () => {
  it('should retrieve all products', async () => {
    const res = await request(app.callback())
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
    expect(res.statusCode).toEqual(200)
  })
});

//GET BY ID
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .get('/api/v1/products/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the product exists', () => {
  it('Should fail due to a product not existing at that ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/products/100')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "Product ID not found")
  })
});
describe('retrieve a product', () => {
  it('Should return the data of the products ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/products/3')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(200)
  })
});

//POST
describe('Check if the user has the correct permissons for creating a product', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        name: 'testalbum',
        trackLength: 39.00,
        price: 89.00,
        formats: 'CD',
        colour: "Black"
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permissions Denied")
  })
});
describe('cannot create the product as the body is incorrect', () => {
  it('should not create a product', async () => {
    const res = await request(app.callback())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        name: 'testalbum',
        trackLength: 39.00,
        formats: 'CD',
        colour: "Black"
      })
    expect(res.statusCode).toEqual(400)
  })
});
describe('Successfully create the product', () => {
  it('Should create a new product', async () => {
    const res = await request(app.callback())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'testalbum',
        trackLength: 39.00,
        price: 89.00,
        formats: 'CD',
        colour: "Black"
      })
    expect(res.statusCode).toEqual(201)
  })
});

//PUT
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .put('/api/v1/products/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the product exists', () => {
  it('Should fail due to a product not existing at that ID', async () => {
    const res = await request(app.callback())
      .put('/api/v1/products/100')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "Product not found")
  })
});
describe('Check if the user has the correct permissons to update a product', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .put('/api/v1/products/2')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Update has been successful', () => {
  it('should update the specified product', async () => {
    console.log("=========================================================================",app.callback());
    const res = await request(app.callback())
      .put('/api/v1/products/3')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'testalbum',
        trackLength: 39.00,
        price: 89.00,
        formats: 'CD',
        colour: "Black"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', "Product Updated")
  })
});

//DELETE
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/products/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the user has the correct permissons to delete a product', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/products/2')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Successfully deleted', () => {
  it('Should delete the products', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/products/1')
      .set('Authorization', `Bearer ${tokenAdmin}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("message", "Product Deleted")
  })
});



//payments
//GET ALL
describe('User doesnt have permission to see all payments', () => {
  it('should fail due to permissions being denied', async () => {
    const res = await request(app.callback())
      .get('/api/v1/payments')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403) 
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Get all payments', () => {
  it('should retrieve all users', async () => {
    const res = await request(app.callback())
      .get('/api/v1/payments')
      .set('Authorization', `Bearer ${tokenAdmin}`)
    expect(res.statusCode).toEqual(200)
  })
});

//GET BY ID
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .get('/api/v1/payments/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the payment exists', () => {
  it('Should fail due to a payment not existing at that ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/payments/100')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "Payment ID not found")
  })
});

describe('retrieve a payment', () => {
  it('Should return the data of the payments ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/payments/3')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(200)
  })
});

//POST
describe('cannot create the payment due to incorrect body', () => {
  it('should not create a payment', async () => {
    const res = await request(app.callback())
      .post('/api/v1/payments')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        "orderID": 6,
        "userID": 6,
        "paymentStatus": "Unsuccessful",
        "paymentDate": "2025-03-25 11:12:13.000"
      })
    expect(res.statusCode).toEqual(400)
  })
});
describe('Successfully created the payment', () => {
  it('Should create a new payment', async () => {
    const res = await request(app.callback())
      .post('/api/v1/payments')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        "orderID": 6,
        "userID": 6,
        "cost": 27.99,
        "paymentStatus": "Unsuccessful",
        "paymentDate": "2025-03-25 11:12:13.000"
      })
    expect(res.statusCode).toEqual(201)
  })
});

//PUT
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .put('/api/v1/payments/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
  })
});
describe('Check if the payment exists', () => {
  it('Should fail due to a payment not existing at that ID', async () => {
    const res = await request(app.callback())
      .put('/api/v1/payments/100')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        "orderID": 7,
        "userID": 7,
        "cost": 37.99,
        "paymentStatus": "successful",
        "paymentDate": "2025-02-25 11:12:13.000"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "Payment not found")
  })
});
describe('Check if the user has the correct permissons to update a payment', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .put('/api/v1/payments/2')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        "orderID": 7,
        "userID": 7,
        "cost": 37.99,
        "paymentStatus": "successful",
        "paymentDate": "2025-02-25 11:12:13.000"
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Update has been successful', () => {
  it('should update the specified payment', async () => {
    console.log("=========================================================================",app.callback());
    const res = await request(app.callback())
      .put('/api/v1/payments/3')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        "orderID": 7,
        "userID": 7,
        "cost": 37.99,
        "paymentStatus": "successful",
        "paymentDate": "2025-02-25 11:12:13.000"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', "Payment Updated")
  })
});



//orders
//GET ALL
describe('User doesnt have permission to see all orders', () => {
  it('should fail due to permissions being denied', async () => {
    const res = await request(app.callback())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(403) 
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Get all orders', () => {
  it('should retrieve all orders', async () => {
    const res = await request(app.callback())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${tokenAdmin}`)
    expect(res.statusCode).toEqual(200)
  })
});

//GET BY ID
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .get('/api/v1/orders/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty("message", "Invalid ID")
  })
});
describe('Check if the order exists', () => {
  it('Should fail due to a order not existing at that ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/orders/100')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "Order ID not found")
  })
});
describe('retrieve an order', () => {
  it('Should return the data of the orders ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/orders/3')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(200)
  })
});

//POST
describe('cannot create the order due to incorrect body', () => {
  it('should not create an order', async () => {
    const res = await request(app.callback())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        productID: 4,
        userID: 4,
        orderStatus: "Pending",
        orderDate: "2025-03-18 03:52:26.000",
        postcode: "CV7 EAP",
        quantity: 3
      })
    expect(res.statusCode).toEqual(400)
  })
});
describe('Successfully created the order', () => {
  it('Should create a new order', async () => {
    const res = await request(app.callback())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        productID: 4,
        userID: 4,
        paymentID: 4,
        orderStatus: "Pending",
        orderDate: "2025-03-18 03:52:26.000",
        postcode: "CV7 EAP",
        quantity: 3
      })
    expect(res.statusCode).toEqual(201)
  })
});

//PUT
describe('Check the ID is in the correct format', () => {
  it('Should fail due to ID not being in the correct format', async () => {
    const res = await request(app.callback())
      .put('/api/v1/orders/a')
      .set('Authorization', `Bearer ${tokenUser}`)
    expect(res.statusCode).toEqual(400)
  })
});
describe('Check if the order exists', () => {
  it('Should fail due to an order not existing at that ID', async () => {
    const res = await request(app.callback())
      .put('/api/v1/orders/100')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        productID: 4,
        userID: 4,
        paymentID: 4,
        orderStatus: "Pending",
        orderDate: "2025-03-18 03:52:26.000",
        postcode: "CV7 EAP",
        quantity: 3
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty("message", "Order not found")
  })
});
describe('Check if the user has the correct permissons to update an order', () => {
  it('Should fail due to users not having the permission', async () => {
    const res = await request(app.callback())
      .put('/api/v1/orders/2')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        productID: 4,
        userID: 4,
        paymentID: 4,
        orderStatus: "Pending",
        orderDate: "2025-03-18 03:52:26.000",
        postcode: "CV7 EAP",
        quantity: 3
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body).toHaveProperty("message", "Permission Denied")
  })
});
describe('Update has been successful', () => {
  it('should update the specified order', async () => {
    console.log("=========================================================================",app.callback());
    const res = await request(app.callback())
      .put('/api/v1/orders/3')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        productID: 4,
        userID: 4,
        paymentID: 4,
        orderStatus: "Pending",
        orderDate: "2025-03-18 03:52:26.000",
        postcode: "CV7 EAP",
        quantity: 3
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message', "Order Updated")
  })
});