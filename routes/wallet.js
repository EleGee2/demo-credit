const express = require("express");
const WalletController = require("../controllers/wallet/wallet")
const AuthController = require("../controllers/auth")
const router = express.Router()

router.use(AuthController.validateToken)

router.post('/fund', WalletController.fundWallet)
router.post('/withdraw', WalletController.fundWithdrawal)
router.post('/transfer', WalletController.transferFunds)

module.exports = router