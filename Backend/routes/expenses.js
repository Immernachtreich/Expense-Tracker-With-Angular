const express = require('express');

const expenseController = require('../controllers/expenses.js');
const userAuthentication = require('../middleware/auth.js');

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticateUser, expenseController.postAddExpense);

router.get('/get-expenses', userAuthentication.authenticateUser, expenseController.getAllExpenses);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

router.get('/edit-expense/:id', expenseController.getExpense);

router.put('/edit-expense/:id', expenseController.editExpense);

module.exports = router;