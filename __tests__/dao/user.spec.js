const UserDAO = require('../../dao/user');
const db = require('../../db/db');
const sinon = require('sinon');
const expect = require('chai').expect;
const userQueries = require('../../services/user/userQueries');
const walletQueries = require('../../services/wallet/walletQueries');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe('UserDAO', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(jwt, 'sign').returns('mock_token')
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        sandbox.restore()

         db.destroy()
    })

    describe('createUser', () => {
        it('should create a new user and return the new user with a token', async () => {
            // create stubs for the userQueries and walletQueries methods
            sandbox.stub(userQueries, 'getUserByQuery').resolves(null);
            sandbox.stub(userQueries, 'createUser').resolves([{
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@example.com',
                phone_number: '1234567890'
            }]);
            sandbox.stub(walletQueries, 'createWallet').resolves([{
                id: 1,
                user_id: 1,
                balance: 0
            }]);
            sandbox.stub(userQueries, 'updateUserWalletId').resolves();


            // call the createUser method
            const values = {
                firstName: 'Ben',
                lastName: '10',
                email: 'ben10@example.com',
                phoneNumber: '1234567890',
                password: 'password'
            };

            const result = await UserDAO.createUser(values);

            // assert that the userQueries and walletQueries methods were called correctly
            expect(userQueries.getUserByQuery.calledOnce).to.be.true;
            expect(userQueries.getUserByQuery.calledWith({email: values.email})).to.be.true;
            expect(userQueries.createUser.calledOnce).to.be.true;
            expect(walletQueries.createWallet.calledOnce).to.be.true;
            expect(userQueries.updateUserWalletId.calledOnce).to.be.true;

            // assert that the result is what we expect
            expect(result).to.deep.equal({
                id: 1,
                last_name: 'Doe',
                first_name: "John",
                email: 'johndoe@example.com',
                phone_number: '1234567890',
                token: "mock_token"
            })
        })

        it("should throw error if email already registered", async () => {
            sandbox.stub(userQueries, "getUserByQuery").resolves([{ id: 1 }]);

            const values = {
                firstName: 'Ben',
                lastName: '10',
                email: 'ben10@example.com',
                phoneNumber: '1234567890',
                password: 'password'
            };

            try {
              await UserDAO.createUser(values);
            } catch (error) {
              expect(error.message).to.deep.equal("This email is already registered with us");
            }
        })
    })

    describe('loginUser', () => {
        it("should login user and return token", async () => {
            sandbox.stub(userQueries, "getUserByQuery").resolves({ id: 1, password: "password" });
            sandbox.stub(bcrypt, "compareSync").returns(true);

            const values = {
                email: "demo@yopmail.com",
                password: "password"
            }

            const result = await UserDAO.loginUser(values);

            expect(result).to.deep.include({ id: 1 });
            expect(result).to.have.property("token");
            expect(userQueries.getUserByQuery.calledOnce).to.be.true;
            expect(bcrypt.compareSync.calledOnce).to.be.true;
        })

        it("should throw error if user not found", async () => {
            const values = {
                email: "demo@yopmail.com",
                password: "password"
            }
            sandbox.stub(userQueries, "getUserByQuery").resolves(null);
            try {
                await UserDAO.loginUser(values);
            } catch (error) {
                expect(error.message).to.deep.equal("User not found");
            }
        })

        it("should throw error if password is invalid", async () => {
            const values = {
                email: "demo@yopmail.com",
                password: "password"
            }
            sandbox.stub(userQueries, "getUserByQuery").resolves({ password: "password" });
            try {
                await UserDAO.loginUser({values, password: "wrongpassword"});
            } catch (error) {
                expect(error.message).to.deep.equal("Incorrect email or password");
            }
        })
    })
})
