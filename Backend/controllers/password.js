const url = 'http://localhost:5005/';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Model Imports
const Users = require('../models/users');
const ForgotPassword = require('../models/forgotPassword');

exports.forgotPassword = async (req, res, next) => {

    try {
        // Send an email to the retrieved email using sendgrid
        // Send the reset link to mail
        const uuid = uuidv4();

        const user = await Users.findOne({ 'email': req.body.email });

        await ForgotPassword.create({
            uuid: uuid,
            isActive: true,
            userId: user
        });
        
        const resetLink = url + 'password/reset-password/' + uuid;

        res.json({ link: resetLink });
    } catch(err) {
        console.log(err);
    }
}

exports.resetPassword = async (req, res, next) => {

    try {
        const uuid = req.params.uuid;

        const request = await ForgotPassword.findOne({ 'uuid': uuid });

        if(request.isActive === true){ 

            await ForgotPassword.findOneAndUpdate({ 'uuid': uuid }, { isActive: false });

            res.send(
                `<html>
                <form action="/password/update-password/${uuid}" method="GET">
                
                    <label for="Password-Input"> New Password </label>
                    <input type="password" name="password" id="Password-Input">
                
                    <button type="submit"> Reset Password </button>
                </form>
                </html>`
            );
        }
        else {
            res.status(400).json( { message: 'Request inactive' } );
        }
    } catch(err) {
        res.status(400).json( { success: false, message: err} );
    }
}

exports.updatePassword = async (req, res, next) => {

    const uuid = req.params.uuid;
    const password = req.query.password;

    const request = await ForgotPassword.findOne({ 'uuid': uuid });

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    await Users.findByIdAndUpdate(request.userId, { password: hash });

    res.send(
        `<html>
            <h1> Success </h1> 
        </html>`
    );
}