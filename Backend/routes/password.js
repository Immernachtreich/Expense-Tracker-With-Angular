const express = require('express');

const userAuthentication = require('../middleware/auth.js');
const passwordController = require('../controllers/password.js');

const router = express.Router();

router.post('/forgot-password', passwordController.forgotPassword);

router.get('/reset-password/:uuid', passwordController.resetPassword);

router.get('/update-password/:uuid', passwordController.updatePassword);

module.exports = router;