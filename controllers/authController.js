const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils')

// use await below because it is async
const register = async (req, res) => {
    const { email, name, password } = req.body;
    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists.')
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    // *** creating user here ***
    const user = await User.create({ email, name, password, role });

    // *** pass user json web token (jwt) here ***
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};


const login = async (req, res) => {
    const { email, password } = req.body;
    // check if they have entered email and password
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password.');
    }
    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid credentials.');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials.');
    }

    // *** pass user json web token (jwt) here ***
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });


}
const logout = async (req, res) => {
    // remove cookie from the browser.
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    // for dev purposes
    res.status(StatusCodes.OK).json({ msg: 'User logged out.' });
};

module.exports = {
    register,
    login,
    logout,
};