const jwt = require('jsonwebtoken');

exports.generateToken = (id, username)  => {

    return jwt.sign({
        userId: id,
        username: username
    }, '98544359375');
}