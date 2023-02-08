const Users = require('../models/users');
const Expenses = require('../models/expenses');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch(err) {
        console.log(err);
    }
}

exports.getUserExpenses = async (req, res, next) => {
    try {
        const userId = req.header('userId');
        const expenses = await Expenses.find({ 'userId': userId });
        console.log(expenses);
        res.json(expenses);
    } catch(err) {
        console.log(err);
    }
}