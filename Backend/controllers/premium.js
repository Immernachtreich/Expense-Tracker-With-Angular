// Services Import
const RazorPayServices = require('../services/razorpayServices.js');
const AWSServices = require('../services/awsServices.js');

// Model Imports
const User = require('../models/users');
const Expenses = require('../models/expenses');
const DownloadLinks = require('../models/downloadLinks');

exports.buyPremium = async (req, res, next) => {

    try {
        const order = await RazorPayServices.createOrder();

        await User.findByIdAndUpdate(
            req.user._id, 
            { 'order': {
                orderId: order.id,
                status: 'PENDING',
            }}
        );
        
        res.status(201).json({
            orderId: order.id,
            key_id: process.env.KEY_ID
        });
    } catch(err) {
        console.log(err);
    }
}

exports.postTransactionStatus = async (req, res, next) => {

    try {
        const {orderId, paymentId} = req.body;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {
            'order': {
                orderId: orderId,
                paymentId: paymentId,
                status: 'SUCCESSFULL'
            },
            'isPremium': true
        });

        res.status(202).json({
            message: "Transaction Successful" 
        });

    } catch(err) {
        console.log(err);
        res.status(400).json({
            message: "Transaction Failed"
        });
    }
}

exports.getReportExpenses = async (req, res, next) => {
    try{
        if(req.user.isPremium === false) {
            throw new Error();
        }

        const ITEMS_PER_PAGE = parseInt(req.query.rows);
        const userId = req.user.id;
        const pageNumber = req.query.page;

        console.log(ITEMS_PER_PAGE);

        const totalExpenses = await Expenses.count({ userId: userId });

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

        res.json(data);

    } catch(err) {

        console.log(err);
        res.status(401).json({message: 'Unauthorized'});
    }
}

exports.downloadExpense = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const expenses = await Expenses.find({ userId: userId });

        const expensesStringified = JSON.stringify(expenses);

        const fileName = `Expenses-${userId}/Expenses-${userId}-${new Date().getTime()}.txt`;

        const fileUrl = await AWSServices.uploadToS3(expensesStringified, fileName);

        await DownloadLinks.create({
            fileUrl: fileUrl,
            fileName: fileName,
            userId: req.user
        });

        res.status(200).json({
            fileUrl: fileUrl,
            success: true 
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({message: 'Something went wrong'});
    }
}

exports.getPastReports = async (req, res, next) => {
    try{
        if(req.user.isPremium === false) {
            throw new Error();
        }

        const userId = req.user.id;

        const downloadLinks = await DownloadLinks.find({ userId: userId });

        res.json(downloadLinks);
        
    } catch(err) {
        res.status(401).json({message: 'Unauthorized'});
    }
}