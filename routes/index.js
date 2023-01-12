const express = require("express");
const app = express()

const UserRouter = require('./user')
const WalletRouter = require('./wallet')

app.use("/api/user", UserRouter)
app.use("/api/wallet", WalletRouter)

module.exports = app