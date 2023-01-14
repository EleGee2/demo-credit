const chai = require('chai');
const sinon = require('sinon');
const TransactionController = require('../../controllers/transaction/transaction');
const transactionService = require('../../services/transaction/transaction')
const db = require("../../db/db");
const expect = chai.expect;

describe("TransactionController", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        sandbox.restore()

         db.destroy()
    })

    describe("getUserTransactions", () => {
        it("should return a 200 status and a success message", async () => {
            const req = { user: { email: "davido@yopmail.com" }}
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(transactionService, "getUserTransaction").resolves([
                { type: 'CREDIT_WALLET', amount: 500},
                { type: 'DEBIT_WALLET', amount: 500}
            ])

            await TransactionController.getUserTransactions(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith({ message: "Transactions gotten successfully"}))
        })

        it("should return a 400 status and an error message", async () => {
            const req = { body: { amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(transactionService, 'getUserTransaction').rejects(new Error('Error getting user transactions'))

            await TransactionController.getUserTransactions(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.calledWith({ message: "Error getting user transactions"})).to.be.true;
        })
    })
})