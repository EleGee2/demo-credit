const chai = require('chai');
const sinon = require('sinon');
const WalletDAO = require('../../dao/wallet');
const userQueries = require('../../services/user/userQueries');
const walletQueries = require('../../services/wallet/walletQueries');
const transactionQueries = require('../../services/transaction/transactionQueries');
const db = require('../../db/db');
const expect = chai.expect;

describe('WalletDAO', () => {
    let sandbox;
    let user;
    let wallet;
    let transaction;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        user = {id: 1};
        wallet = {id: 1, user_id: 1, balance: 100};
        transaction = {
            type: "CREDIT_WALLET",
            amount: 100,
            to: 1,
            status: "SUCCESS",
            reference: `GETXN_TKN_SEND_42HVjvCLg`
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        sandbox.restore()

         db.destroy()
    })

    describe('fundWallet', () => {
        it('should return the updated wallet and create a transaction', async () => {
            const values = {amount: 100};
            sandbox.stub(userQueries, 'getUserById').resolves(user);
            sandbox.stub(walletQueries, 'getWalletByUserId').resolves(wallet);
            sandbox.stub(walletQueries, 'incrementWallet').resolves({...wallet, balance: 200});
            sandbox.stub(transactionQueries, 'createTransaction').resolves(transaction);

            const updatedWallet = await WalletDAO.fundWallet(user, values);

            expect(updatedWallet).to.deep.equal({...wallet, balance: 200});
            expect(transactionQueries.createTransaction.args[0][0].reference).to.match(/^GETXN_TKN_SEND_\w{9}$/);

        });

        it('should throw an error if the user is not found', async () => {
            const values = {amount: 100};
            sandbox.stub(userQueries, 'getUserById').resolves(null);

            try {
                await WalletDAO.fundWallet(user, values);
                expect.fail();
            } catch (error) {
                expect(error.message).to.equal('User not found with id: 1');
            }
        });

        it('should throw an error if amount is not provided', async () => {
            try {
                await WalletDAO.fundWallet(user, {});
                expect.fail();
            } catch (error) {
                expect(error.message).to.equal('Missing required input: amount should be provided.');
            }
        });
    })

    describe('fundWithdrawal', () => {
        const values = { amount: 20 }
        it('should withdraw funds from user wallet', async () => {
            const getUserByIdStub = sandbox.stub(userQueries, 'getUserById').resolves({ id: 1 });
            const getWalletByUserIdStub = sandbox.stub(walletQueries, 'getWalletByUserId').resolves({ id: 1 });
            const decrementWalletStub = sandbox.stub(walletQueries, 'decrementWallet').resolves({ ...wallet, balance: 80});
            const createTransactionStub = sandbox.stub(transactionQueries, 'createTransaction').resolves();

            const updatedWallet = await WalletDAO.fundWithdrawal(user, values);

            expect(getUserByIdStub.calledOnce).to.be.true;
            expect(getUserByIdStub.calledWith(user.id)).to.be.true;
            expect(getWalletByUserIdStub.calledOnce).to.be.true;
            expect(getWalletByUserIdStub.calledWith(user.id)).to.be.true;
            expect(decrementWalletStub.calledOnce).to.be.true;
            expect(decrementWalletStub.calledWith(1, values.amount)).to.be.true;
            expect(createTransactionStub.calledOnce).to.be.true;
            expect(updatedWallet).to.deep.equal({ ...wallet, balance: 80 });
        })

        it('should throw error if user is not found', async () => {
          sandbox.stub(userQueries, 'getUserById').resolves(null);

          try {
            await WalletDAO.fundWithdrawal(user, values);
          } catch (error) {
            expect(error.message).to.equal("User not found with id: 1");
          }
        });

        it('should throw error if user wallet is not found', async () => {
          sandbox.stub(userQueries, 'getUserById').resolves({ id: 1 });
          sandbox.stub(walletQueries, 'getWalletByUserId').resolves(null);

          try {
            await WalletDAO.fundWithdrawal(user, values);
          } catch (error) {
            expect(error.message).to.equal("User Wallet not found");
          }
        });

        it('should throw error if amount is not provided', async () => {
          values.amount = null;
          try {
            await WalletDAO.fundWithdrawal(user, values);
          } catch (error) {
            expect(error.message).to.equal("Missing required input: amount should be provided.");
          }
        });
    })

    describe('fundTransfer', () => {
        const values = { email: 'receiver@example.com', amount: 100 };

        it("should transfer funds successfully", async () => {
            sandbox.stub(userQueries, 'getUserById').resolves({ id: 1 });
            sandbox.stub(userQueries, 'getUserByQuery').resolves({ id: 2 });
            const getWalletByUserIdStub = sandbox.stub(walletQueries, 'getWalletByUserId');
            getWalletByUserIdStub.onCall(0).resolves({ id: 1, balance: 200 });
            getWalletByUserIdStub.onCall(1).resolves({ id: 2 });
            sandbox.stub(walletQueries, 'decrementWallet').resolves({});
            sandbox.stub(walletQueries, 'incrementWallet').resolves({});
            sandbox.stub(transactionQueries, 'createTransaction').resolves({});

            const result = await WalletDAO.transferFunds(user, values);

            console.log(result)

            expect(result).to.be.true;
            expect(userQueries.getUserById.calledOnce).to.be.true;
            expect(userQueries.getUserByQuery.calledOnce).to.be.true;
            expect(walletQueries.getWalletByUserId.calledTwice).to.be.true;
            expect(walletQueries.decrementWallet.calledOnce).to.be.true;
            expect(walletQueries.incrementWallet.calledOnce).to.be.true;
            expect(transactionQueries.createTransaction.calledTwice).to.be.true;
        })

        it('should throw error if email and amount is not supplied', async () => {
            try {
              await WalletDAO.transferFunds(user, {});
            } catch (error) {
              expect(error.message).to.deep.equal("Please supply email and amount");
            }
          });

        it('should throw error if sender or receiver is not found', async () => {
            sandbox.stub(userQueries, 'getUserById').resolves(null);
            sandbox.stub(userQueries, 'getUserByQuery').resolves(null);

            try {
              await WalletDAO.transferFunds(user, values);
            } catch (error) {
              expect(error.message).to.deep.equal("User not found");
            }
          });

        it('should throw error if sender has insufficient funds', async () => {
            sandbox.stub(userQueries, 'getUserById').resolves({ id: 1 });
            sandbox.stub(userQueries, 'getUserByQuery').resolves({ id: 2 });
            const getWalletByUserIdStub = sandbox.stub(walletQueries, 'getWalletByUserId');
            getWalletByUserIdStub.onCall(0).resolves({ id: 1, balance: 0 });
            getWalletByUserIdStub.onCall(1).resolves({ id: 2 });

            try {
              await WalletDAO.transferFunds(user, values);
            } catch (error) {
              expect(error.message).to.deep.equal("Insufficient funds");
            }
          });

        it("should throw error if sender or receiver wallet is not found", async () => {
            sandbox.stub(userQueries, 'getUserById').resolves({ id: 1 });
            sandbox.stub(userQueries, 'getUserByQuery').resolves({ id: 2 });
            sandbox.stub(walletQueries, 'getWalletByUserId').resolves(null);

            try {
                await WalletDAO.transferFunds(user, values);
            } catch (error) {
                expect(error.message).to.deep.equal("Wallet not found");
            }
        })
    })
})
