const TransactionDAO = require('../../dao/transaction')

class TransactionService {
    getUserTransaction(userDto) {
        return TransactionDAO.getUserTransactions(userDto)
    }
}

module.exports = new TransactionService()