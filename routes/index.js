const express = require("express");
const app = express()

const UserRouter = require('./user')
const WalletRouter = require('./wallet')
const TransactionRouter = require('./transaction')

app.use("/api/users", UserRouter)
app.use("/api/wallets", WalletRouter)
app.use("/api/transactions", TransactionRouter)

module.exports = app