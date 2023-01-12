const db = require("../../db/db");

const Transactions = function() {
    return db("transaction")
}

const createTransaction = async (values, trx) => {
    return Transactions().insert({...values}).returning("*");
}

const getTransactionByQuery = async (query) => {
    return Transactions().where({...query}).first()
}

module.exports = {
    createTransaction,
    getTransactionByQuery
}