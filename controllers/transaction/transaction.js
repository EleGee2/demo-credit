const transactionService = require('../../services/transaction/transaction')

class TransactionController {
    async getUserTransactions(req, res) {
        try {
            const transactions = await transactionService.getUserTransaction(req.user)

            return res.status(200).json({
                message: "Transactions gotten successfully",
                payload: {
                    transactions
                }
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new TransactionController()