const TransactionDAO = require('../../dao/transaction')
const db = require('../../db/db');
const sinon = require('sinon');
const expect = require('chai').expect;
const UserQueries = require('../../services/user/userQueries');
const TransactionQueries = require('../../services/transaction/transactionQueries');

describe('TransactionDAO', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        sandbox.restore()

         db.destroy()
    })

    describe('getUserTransactions', () => {
        it('should successfully get all user transactions', async () => {
            const user = { id: 1 }
            const transactions = [
                { id: 1, amount: 100},
                { id: 2, amount: 200}
            ]

            sandbox.stub(UserQueries, 'getUserByQuery').resolves({id: 1 })
            sandbox.stub(TransactionQueries, 'getUserTransactions').resolves(transactions)

            const result = await TransactionDAO.getUserTransactions(user);
            expect(result).to.deep.equal(transactions);
            expect(UserQueries.getUserByQuery.calledOnce).to.be.true;
            expect(TransactionQueries.getUserTransactions.calledOnce).to.be.true;
        })

        it("should throw an error if user is not found", async () => {
            const user = { id: 1 };
            sandbox.stub(UserQueries, "getUserByQuery").resolves(null);
            try {
                await TransactionDAO.getUserTransactions(user);
            } catch (error) {
                expect(error.message).to.deep.equal("User not found");
                expect(UserQueries.getUserByQuery.calledOnce).to.be.true;
            }
        });
    })
})