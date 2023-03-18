const CustomError = require('../errors');
const { removeListener } = require('../models/User');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
    // looking for signedCookies.token because the res in 
    // attachCookiesToResponse function names it token in the cookie() method
    // in the jwt.js
    const token = req.signedCookies.token;
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    try {
        // const payload = isTokenValid({ token });
        // req.user = { name: user.name, userId: user._id, role: user.role }
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role }

        // need to invoke next() to go to the next middlware.
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');

    }

};
// ***** below the rest operator is collecting the roles from userRoutes *****
const authorizePermissions = (...roles) => {
    // if (req.user.role !== 'admin') {
    //     throw new CustomError.UnauthorizedError('Unauthorized to access this route.');
    // }
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route.');
        }
        next();
    };


};

module.exports = {
    authenticateUser,
    authorizePermissions,
};