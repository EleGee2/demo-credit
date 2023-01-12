const WalletDao = require('../../dao/wallet')

class WalletService {
    fundWallet(userDto, walletDto) {
        return WalletDao.fundWallet(userDto, walletDto)
    }
    fundWithdrawal(userDto, walletDto) {
        return WalletDao.fundWithdrawal(userDto, walletDto)
    }

    transferFunds(userDto, walletDto) {
        return WalletDao.transferFunds(userDto, walletDto)
    }
}

module.exports = new WalletService();