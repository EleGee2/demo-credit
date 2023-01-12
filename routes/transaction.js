const express = require("express");
const TransactionController = require("../controllers/transaction/transaction")
const AuthController = require("../controllers/auth");

const router = express.Router()

router.use(AuthController.validateToken)

router.get('/', TransactionController.getUserTransactions)

module.exports = router