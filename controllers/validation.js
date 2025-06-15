/**
 * A module to run basic validation on responses and requests for data
 * @module controllers/validation
 * @author Jeffrey Ting
 * @see schemas/* for schema definition file
 */

const {Validator, ValidationError} = require('jsonschema');

const productSchema = require('../schemas/product.json').definitions.product;
const productUpdateSchema = require('../schemas/product.json').definitions.productUpdate;
const userSchema = require('../schemas/user.json').definitions.user;
const userUpdateSchema = require('../schemas/user.json').definitions.userUpdate;
const paymentSchema = require('../schemas/payment.json').definitions.payment;
const paymentUpdateSchema = require('../schemas/payment.json').definitions.paymentUpdate;
const orderSchema = require('../schemas/order.json').definitions.order;
const orderUpdateSchema = require('../schemas/order.json').definitions.orderUpdate;

/**
 * Wrapper that returns a Koa middleware validator for a given schema
 * @param {Object} schema - The schema definition of the resource
 * @param {string} resource - The name of a resource e.g. products
 * @returns {function} - A Koa middleware handler taking (ctx, next parameters)
 */

const makeKoaValidator = (schema, resource) => {

  const v = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource
  };
  
  /**
 * Koa middleware handler function to do validation
 * @param {object} ctx - The Koa request/ response context object
 * @param {function} next - The Koa next callback
 * @throws {ValidationError} - a jsonschema library exception
 */
  const handler = async (ctx, next) => {

    const body = ctx.request.body;

    try {
      v.validate(body, schema, validationOptions);
      await next();
    } 
    catch (error) {
      if (error instanceof ValidationError) {
        console.error(error);
        ctx.status = 400
        ctx.body = error;
      } 
      else {
        throw error;
      }
    }
  }
  return handler;
}

/** Validate data against validateProduct Schema for creating*/
exports.validateProduct = makeKoaValidator(productSchema, 'product');
/** Validate against validateUpdateProduct schema for updating */
exports.validateUpdateProduct = makeKoaValidator(productUpdateSchema, 'productUpdate');
/** Validate data against validateUser Schema for creating*/
exports.validateUser = makeKoaValidator(userSchema, 'user');
/** Validate against validateUpdateUser schema for updating */
exports.validateUpdateUser = makeKoaValidator(userUpdateSchema, 'userUpdate');
/** Validate data against validatePayment Schema for creating*/
exports.validatePayment = makeKoaValidator(paymentSchema, 'payment');
/** Validate against validateUpdatePayment schema for updating */
exports.validateUpdatePayment = makeKoaValidator(paymentUpdateSchema, 'paymentUpdate');
/** Validate data against validateOrder Schema for creating*/
exports.validateOrder = makeKoaValidator(orderSchema, 'order');
/** Validate against validateUpdateOrder schema for updating */
exports.validateUpdateOrder = makeKoaValidator(orderUpdateSchema, 'orderUpdate');