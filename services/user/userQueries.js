const db = require("../../db/db");

const Users = function () {
  return db("user");
};

const getUserById = async (id, trx) => {
    return Users().transacting(trx).where({id: id}).first();
};

const updateUserWalletId = async (userId, walletId, trx) => {
    return Users().transacting(trx).where({id: userId}).update({wallet_id: walletId});
};

const getUserByQuery = async (query) => {
    return Users().where({...query}).first()
}

const createUser = async (values, trx) => {
    return Users().transacting(trx).insert({...values}).returning("id").then(id => {
        return Users().transacting(trx).select("*").where("id", id[0]).first()
    })
}


module.exports = {
    getUserById,
    updateUserWalletId,
    getUserByQuery,
    createUser
}