// API Imports
const RazorPay = require('razorpay');

exports.createOrder = () => {

    const instance = new RazorPay({ 
        key_id: process.env.KEY_ID, 
        key_secret: process.env.KEY_SECRET 
    });
    
    const options = {
        amount: 100,  // amount in the smallest currency unit
        currency: "INR" // Currency Code as per Standard
    }
    
    return instance.orders.create(options);
}