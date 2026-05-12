const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getSummary,
} = require('../controllers/expenseController');

router.get('/summary', getSummary);
router.route('/').get(getAllExpenses).post(createExpense);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

module.exports = router;
