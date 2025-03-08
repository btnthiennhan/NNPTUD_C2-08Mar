const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let categorySchema = require('../models/catgories')

// GET all categories - Chỉ lấy các category chưa bị delete
router.get('/', async function(req, res, next) {
  let queries = req.query;
  let categories = await categorySchema.find({ isDeleted: false });
  res.send(categories);
});

// GET category by id - Kiểm tra isDeleted
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findOne({ 
      _id: req.params.id,
      isDeleted: false 
    });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found or has been deleted"
      });
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    })
  }
});

// Các route khác (POST, PUT, DELETE) giữ nguyên
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categorySchema({
      categoryName: body.categoryName,
      description: body.description
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let category = await categorySchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    })
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;