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
    ).returning("id").then(id => {
        return Wallets().transacting(trx).select("*").where("id", id[0]).first()
    })
};

const incrementWallet = async (id, amount, trx) => {
    return Wallets().where({id}).transacting(trx).increment("balance", amount).returning("*").then(() => {
            return Wallets().select('*').where({id}).transacting(trx).first();
        });
};

const decrementWallet = async (id, amount, trx) => {
    return Wallets().where({id}).transacting(trx).decrement("balance", amount).returning("*").then(() => {
            return Wallets().select('*').where({id}).transacting(trx).first();
        });
};


module.exports = {
    getWalletByUserId,
    createWallet,
    incrementWallet,
    decrementWallet
}

