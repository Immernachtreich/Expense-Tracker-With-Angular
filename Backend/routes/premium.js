const express = require('express');

const userAuthentication = require('../middleware/auth.js');
const premiumController = require('../controllers/premium.js');

const router = express.Router();

router.post('/get-premium', userAuthentication.authenticateUser, premiumController.buyPremium);

router.post('/transaction-status', userAuthentication.authenticateUser, premiumController.postTransactionStatus);

router.get('/get-report', userAuthentication.authenticateUser, premiumController.getReportExpenses);

router.get('/download-report', userAuthentication.authenticateUser, premiumController.downloadExpense);

router.get('/past-reports', userAuthentication.authenticateUser, premiumController.getPastReports);

module.exports = router;