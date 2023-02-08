//Model Imports
const Expenses = require('../models/expenses');

const ITEMS_PER_PAGE = 6;

exports.postAddExpense = async (req, res, next) => {
    const {expenseAmount, description, category} = req.body;

    try {
        const expense = {
            expenseAmount: expenseAmount,
            description: description,
            category: category,
            createdAt: new Date(),
            userId: req.user
        };
        const result = await Expenses.create(expense);

        res.status(201).json(result);

    } catch(err) {
        console.log(err);
    }
}

exports.getAllExpenses = async (req, res, next) => {

    try{
        const pageNumber = req.query.page;

        const totalExpenses = await Expenses.count({ userId: req.user._id });

        const expenses = await Expenses
            .find({ 'userId': req.user._id })
            .limit(ITEMS_PER_PAGE)
            .skip((pageNumber - 1) * ITEMS_PER_PAGE);

        const data = {
            expenses: expenses, 
            isPremium: req.user.isPremium,

            totalExpenses: totalExpenses,

            hasNextPage: (ITEMS_PER_PAGE * pageNumber) < totalExpenses,
            hasPreviousPage: pageNumber > 1,

            nextPage: parseInt(pageNumber) + 1,
            currentPage: parseInt(pageNumber),
            previousPage: parseInt(pageNumber) - 1,
            lastPage: Math.ceil(totalExpenses / ITEMS_PER_PAGE)
        }

        res.status(200).json(data);
    } catch(err) {
        console.log(err);
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const id = req.params.id;

        const expense = await Expenses.findById(id);

        res.json(expense);
    } catch(err) {
        console.log(err);
        res.status(404).json({success: false});
    }
}

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    try{
        await Expenses.findByIdAndRemove(id);
        res.status(200).json({success: true});
    } catch(err) {
        console.log(err);
        res.status(401).json({unauthorized: true});
    }
}

exports.editExpense = async (req, res, next) => {

    try {
        const id = req.params.id;

        await Expenses.findByIdAndUpdate(id, req.body);

        res.status(200).json({success: true});
    } catch(err) {
        console.log(err);
        res.status(401).json({unauthorized: true});
    }
}