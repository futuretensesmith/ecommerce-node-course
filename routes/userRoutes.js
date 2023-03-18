// ***** set up all of the routes and import the controllers *****
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
} = require('../controllers/userController');
// all of the routes will have authentication middleware.
// first authenticateUser then authorizePermissions. Placement is important because we are checking
// if role is admin or just user.
router.route('/').get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;

