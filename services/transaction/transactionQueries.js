const db = require("../../db/db");

const Transactions = function() {
    return db("transaction")
}

const createTransaction = async (values, trx) => {
    return Transactions().transacting(trx).insert({...values}).returning("*");
}

const getTransactionByQuery = async (query) => {
    return Transactions().where({...query}).first()
}

const getUserTransactions = async (query1, query2) => {
    return Transactions().where(function() {
        this.where({...query1 }).orWhere({...query2}).select("*")
    })
}

module.exports = {
    createTransaction,
    getTransactionByQuery,
    getUserTransactions
}