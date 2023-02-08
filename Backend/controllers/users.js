// Service Imports
const bcrypt = require('bcrypt');
const jwtServices = require('../services/jwtServices.js');
const Joi = require('joi');

//Model Imports
const User = require('../models/users');

// Sign Up
exports.postAddUser = async (req, res, next) => {

    const { username, email, password } = req.body;

    try {
        const user = await User.findOne({ 'email': email });

        if(!user) {
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);

            const userData = {
                username: username,
                email: email,
                password: hash,
                isPremium: false
            };

            await User.create(userData);
            
            res.status(201).json({alreadyExisting: false});

        } else {
            res.status(200).json({alreadyExisting: true});
        }
    } catch(err) {
        console.log(err);
    }
}

// Login
exports.loginUser = async (req, res, next) => {

    const { email, password } = req.body;

    const schema = Joi.object({
        email: Joi.string().required().custom((value) => {
            if(!value.includes('@')) {
                throw 'email does not contain @';
            }    
        }),
        password: Joi.string().min(5).required()
    }).with('email', 'password');

    try {   
        await schema.validateAsync(req.body);
    } catch(err) {
        console.log(err.details);
        if(err.details[0].type === 'string.min') {
            res.status(404).json({ message: `${err.details[0].context.key} length incorrect` });
            return;
        }
    }
    
    try {
        const user = await User.findOne({ 'email': email });

        if(user) {
            // returns a boolean value
            const correctPassword = await bcrypt.compare(password, user.password);
            
            if(correctPassword) {
                res.status(200).json({
                    userExists: true,
                    correctPassword:true,
                    token: jwtServices.generateToken(user.id, user.username)
                });
            } else {
                res.status(401).json({
                    userExists: true,
                    correctPassword:false
                });
            }
        } else {
            res.status(404).json({userExists: false});
        }
    } catch(err) {
        console.log(err);
    }
}