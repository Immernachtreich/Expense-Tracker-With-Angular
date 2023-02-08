const jwt = require('jsonwebtoken');

// Model Imports
const Users = require('../models/users');

exports.authenticateUser = async (req, res, next) => {

    try{
        const token = req.header('Authorization');
        const userDetails = jwt.verify(token, '98544359375');

        const user = await Users.findById(userDetails.userId);
        req.user = user;

        next();
    } catch(err) {
        res.status(401).json({token: 'Doesnt Exists'});
        console.log(err);
    }
}