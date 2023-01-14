const chai = require('chai');
const sinon = require('sinon');
const WalletController = require('../../controllers/wallet/wallet');
const walletService = require('../../services/wallet/wallet')
const db = require("../../db/db");
const expect = chai.expect;


describe("WalletController", () => {
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

    describe('fundWallet', () => {
        it("should return a 200 status and a success message", async () => {
            const req = { body: { amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(walletService, 'fundWallet').resolves([{ balance: 200 }])

            await WalletController.fundWallet(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith({ message: "Account funded successfully", payload: { balance: 200 }}))
        })

        it("should return a 400 status and an error message", async () => {
            const req = { body: { amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(walletService, 'fundWallet').rejects(new Error('Error funding wallet'))

            await WalletController.fundWallet(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.calledWith({ message: "Error funding wallet"})).to.be.true;
        })
    })

    describe('fundWithdrawal', () => {
        it("should return a 200 status and a success message", async () => {
            const req = { body: { amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(walletService, 'fundWithdrawal').resolves([{ balance: 200 }])

            await WalletController.fundWithdrawal(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith({ message: "Funds withdrawn successfully", payload: { balance: 200 }}))
        })

        it("should return a 400 status and an error message", async () => {
            const req = { body: { amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(walletService, 'fundWithdrawal').rejects(new Error('Error withdrawing funds'))

            await WalletController.fundWithdrawal(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.calledWith({ message: "Error withdrawing funds"})).to.be.true;
        })
    })

    describe('transferFunds', () => {
        it("should return a 200 status and a success message", async () => {
            const req = { body: { email: "asake@yopmail.com", amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(walletService, 'transferFunds').resolves([{ balance: 200 }])

            await WalletController.transferFunds(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith({ message: "Funds transferred successfully", payload: { balance: 200 }}))
        })

        it("should return a 400 status and an error message", async () => {
            const req = { body: { amount: "200" }};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })};
            sandbox.stub(walletService, 'transferFunds').rejects(new Error('Error transferring funds'))

            await WalletController.transferFunds(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.calledWith({ message: "Error transferring funds"})).to.be.true;
        })
    })
})