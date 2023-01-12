const db = require("../db/db")
const walletQueries = require("../services/wallet/walletQueries");
const userQueries = require("../services/user/userQueries")
const transactionQueries = require("../services/transaction/transactionQueries")
const { generateTransactionReference } = require("../utils/random")

class WalletDAO {
    async fundWallet(user, values) {
        try {
            // Start a new database transaction
            return await db.transaction(async trx => {
                // Validate input
            if (!values.amount) {
                throw new Error("Missing required input: amount should be provided.");
            }
            // check if user exists
            const checkUser = await userQueries.getUserById(user.id, trx);
            if (!checkUser) {
                throw new Error("User not found with id: " + user.id);
            }
            let wallet;
            // check if wallet exists
            wallet = await walletQueries.getWalletByUserId(user.id);
            if (wallet) {
                // increment balance
                wallet = await walletQueries.incrementWallet(wallet.id, values.amount, trx)
                await transactionQueries.createTransaction({
                    type: "FUND",
                    amount: values.amount,
                    to: checkUser.id,
                    status: "SUCCESS",
                    reference: `GETXN_TKN_SEND_${generateTransactionReference(9)}`
                }, trx)
            } else {
                // create wallet
                wallet = await walletQueries.createWallet(user.id, values.amount, trx);

                // create transaction
                await transactionQueries.createTransaction({
                    type: "CREDIT_WALLET",
                    amount: values.amount,
                    to: checkUser[0].id,
                    status: "SUCCESS",
                    reference: `GETXN_TKN_FUND_${generateTransactionReference(9)}`
                }, trx)
                // update user with wallet id
                await userQueries.updateUserWalletId(user.id, wallet.id, trx);
            }
            return wallet;

            })

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async fundWithdrawal(user, values) {
        try {
            return await db.transaction(async trx => {
                if (!values.amount) {
                throw new Error("Missing required input: amount should be provided.");
            }
            // check if user exists
            const checkUser = await userQueries.getUserById(user.id, trx);
            if (!checkUser) {
                throw new Error("User not found with id: " + user.id);
            }

            // check if user wallet exists
            let wallet = await walletQueries.getWalletByUserId(user.id);
            if (!wallet) {
                throw new Error("User Wallet not found")
            }

            // update wallet with amount to be withdrawn
            wallet = await walletQueries.decrementWallet(wallet.id, values.amount, trx);

            await transactionQueries.createTransaction({
                type: "DEBIT_WALLET",
                amount: values.amount,
                from: checkUser.id,
                status: "SUCCESS",
                reference: `GETXN_TKN_WITHDRAW_${generateTransactionReference(9)}`
            }, trx)
            return wallet
            })

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async transferFunds(user, values) {
        try {
            await db.transaction(async trx => {
                const { email, amount } = values

                if (!email || !amount) throw new Error("Please supply email and amount")

                // check if sender and receiver exists
                const sender = await userQueries.getUserById(user.id, trx)
                const receiver = await userQueries.getUserByQuery({ email })

                if (sender.length === 0 || receiver.length === 0) {
                    throw new Error("User not found");
                }


                // get sender's wallet balance
                const senderWallet = await walletQueries.getWalletByUserId(sender.id)

                // get receiver wallet
                const receiverWallet = await walletQueries.getWalletByUserId(receiver.id)

                if(senderWallet.length === 0 || receiverWallet.length === 0) {
                    throw new Error("Wallet not found")
                }

                if (amount >= senderWallet.balance) {
                    throw new Error("Insufficient funds")
                }

                // Decrease sender wallet balance
                await walletQueries.decrementWallet(senderWallet.id, amount, trx)

                // Increase receiver wallet balance
                await walletQueries.incrementWallet(receiverWallet.id, amount, trx)

                // Create sender and receiver transaction
                await transactionQueries.createTransaction({
                    type: "DEBIT_WALLET",
                    amount,
                    from: sender.id,
                    to: receiver.id,
                    status: "SUCCESS",
                    reference: `GETXN_TKN_DEBIT_${generateTransactionReference(9)}`
                }, trx)

                await transactionQueries.createTransaction({
                    type: "CREDIT_WALLET",
                    amount,
                    from: sender.id,
                    to: receiver.id,
                    status: "SUCCESS",
                    reference: `GETXN_TKN_CREDIT_${generateTransactionReference(9)}`
                }, trx)

                return true
            })
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

module.exports = new WalletDAO();
