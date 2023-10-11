const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/findUserByEmail', userController.userByEmail);
router.put('/update/:id', userController.updateUser);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);


module.exports = router;
