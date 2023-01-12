const walletService = require('../../services/wallet/wallet');

class WalletController {
    async fundWallet(req, res) {
        try {
            const wallet = await walletService.fundWallet(req.user, req.body)
            return res.status(200).json({
                message: "Account funded successfully",
                payload: {
                    balance: wallet[0].balance
                },
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error.message });
        }
    }

    async fundWithdrawal(req, res) {
        try {
            const wallet = await walletService.fundWithdrawal(req.user, req.body)
            return res.status(200).json({
                message: "Funds withdrawn successfully",
                payload: {
                    balance: wallet[0].balance
                },
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error.message });
        }
    }

    async transferFunds(req, res) {
        try {
            await walletService.transferFunds(req.user, req.body)

            return res.status(200).json({
                message: "Funds transferred successfully",
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new WalletController()