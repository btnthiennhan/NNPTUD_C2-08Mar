const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products')
let BuildQueies = require('../Utils/BuildQuery')

router.get('/', async function(req, res, next) {
  let queries = req.query;
  let products = await productSchema
    .find({ ...BuildQueies.QueryProduct(queries), isDeleted: false })
    .populate("categoryID");
  res.send(products);
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findOne({ 
      _id: req.params.id,
      isDeleted: false 
    });
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found or has been deleted"
      });
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.category
  })
  await newProduct.save()
  res.send(newProduct);
});

router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let product = await productSchema.findByIdAndUpdate(req.params.id,
      body, {new: true});
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;