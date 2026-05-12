//categories
const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.route('/').get(getAllCategories).post(createCategory);
router.route('/:id').put(updateCategory).delete(deleteCategory);

module.exports = router;
