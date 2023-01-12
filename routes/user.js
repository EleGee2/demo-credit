const express = require("express");
const UserController = require("../controllers/user/user");
const { validateSignUp, validateLogin } = require("../validations/user.validation")

const router = express.Router();

router.post('/signup', validateSignUp, UserController.createUser);
router.post('/login', validateLogin, UserController.loginUser)

module.exports = router