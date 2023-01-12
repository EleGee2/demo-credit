const db = require("../../db/db");
const Wallets = function () {
    return db("wallet");
}
const getWalletByUserId = async (userId) => {
    return Wallets().where({user_id: userId}).first();
};

const createWallet = async (userId, amount, trx) => {
    return Wallets().transacting(trx).insert(
        {
            balance: amount,
            user_id: userId
        },
        ["id", "balance"]
    ).returning("*");
};

const incrementWallet = async (id, amount, trx) => {
    return Wallets().where({id}).transacting(trx).increment("balance", amount).returning("*");
};

const decrementWallet = async (id, amount, trx) => {
    return Wallets().where({id}).transacting(trx).decrement("balance", amount).returning("*");
};


module.exports = {
    getWalletByUserId,
    createWallet,
    incrementWallet,
    decrementWallet
}

