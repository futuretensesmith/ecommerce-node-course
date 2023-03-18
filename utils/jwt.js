const jwt = require('jsonwebtoken');


// setting up function as an oject. 
// So I don't have to worry about the order of the aurguments
const createJWT = ({ payload }) => {
    // sign(payload,private key , options)
    const token = jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME });
    return token;
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

// this function is getting called with res and user arguments in authController.js
// 
const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });

    const oneDay = 1000 * 60 * 60 * 24;

    // cookie(name, value, {options}) is built into express.
    // attaching cookie to JWT in response here.
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });

};

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
};