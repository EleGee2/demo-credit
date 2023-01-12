const express = require("express");
const WalletController = require("../controllers/wallet/wallet")
const AuthController = require("../controllers/auth")
const { validateFund, validateTransfer, validateWithdrawal } = require("../validations/wallet.validation")
const router = express.Router()

router.use(AuthController.validateToken)

router.post('/fund', validateFund, WalletController.fundWallet)
router.post('/withdraw', validateWithdrawal, WalletController.fundWithdrawal)
router.post('/transfer', validateTransfer, WalletController.transferFunds)

module.exports = router