const chai = require('chai');
const sinon = require('sinon');
const UserController = require('../../controllers/user/user');
const userService = require('../../services/user/user');
const db = require("../../db/db");
const expect = chai.expect;

describe("UserController", () => {
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

    describe('createUser', () => {
        it('should return a 201 status and a success message', async () => {
          const req = { body: { name: 'John Doe', email: 'johndoe@example.com', password: 'password' } };
          const res = { status: sinon.stub().returns({ json: sinon.spy() }) };
          sandbox.stub(userService, 'createUser').resolves({ name: 'John Doe', email: 'johndoe@example.com' });

          await UserController.createUser(req, res);

          expect(res.status.calledWith(201)).to.be.true;
          expect(res.status().json.calledWith({ message: 'User created successfully', user: { name: 'John Doe', email: 'johndoe@example.com' } })).to.be.true;
        });

        it('should return a 400 status and an error message', async () => {
          const req = { body: { name: 'John Doe', email: 'johndoe@example.com', password: 'password' } };
          const res = { status: sinon.stub().returns({ json: sinon.spy() }) };
          sandbox.stub(userService, 'createUser').rejects(new Error('Error creating user'));

          await UserController.createUser(req, res);

          expect(res.status.calledWith(400)).to.be.true;
          expect(res.status().json.calledWith({ message: 'Error creating user' })).to.be.true;
        });
    })

    describe('loginUser', () => {
        it('should return a 200 status and a success message', async () => {
          const req = { body: { email: 'johndoe@example.com', password: 'password' } };
          const res = { status: sinon.stub().returns({ json: sinon.spy() }) };
          sandbox.stub(userService, 'loginUser').resolves({ name: 'John Doe', email: 'johndoe@example.com' });

          await UserController.loginUser(req, res);

          expect(res.status.calledWith(200)).to.be.true;
          expect(res.status().json.calledWith({ message: 'User logged in successfully', user: { name: 'John Doe', email: 'johndoe@example.com' } })).to.be.true;
        });

        it('should return a 400 status and an error message', async () => {
            const req = { body: { email: 'papi@yopmail.com', password: "password"}};
            const res = { status: sinon.stub().returns({ json: sinon.spy() })}
            sandbox.stub(userService, 'loginUser').rejects(new Error('Error logging in user'));

            await UserController.loginUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.status().json.calledWith({ message: 'Error logging in user' })).to.be.true
        })
    })
})