const transactionQueries = require("../services/transaction/transactionQueries")
const userQueries = require("../services/user/userQueries")

class TransactionDAO {
    async getUserTransactions(user) {
        try {
            const currentUser = await userQueries.getUserByQuery({ id: user.id })
            if (!currentUser) {
                throw new Error("User not found")
            }
            const transactions = await transactionQueries.getUserTransactions({ from: user.id }, { to: user.id} )

            return transactions
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

module.exports = new TransactionDAO()