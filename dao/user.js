const db = require("../db/db");
const bcrypt = require("bcryptjs");
const userQueries = require("../services/user/userQueries")
const walletQueries = require("../services/wallet/walletQueries")
const { signToken } = require("../controllers/auth");

class UserDAO {
  async createUser(values) {
    try {
      return await db.transaction(async trx => {
        const checkUser = await userQueries.getUserByQuery({ email: values.email })

        if (checkUser) {
          throw new Error("This email is already registered with us");
        }

        const hash = bcrypt.hashSync(values.password, 10);
        const user = await userQueries.createUser({
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone_number: values.phoneNumber,
          password: hash,
        }, trx)

        const wallet = await walletQueries.createWallet(user.id, 0, trx)

        await userQueries.updateUserWalletId(user.id, wallet.id, trx)

        const token = signToken(user.id, user.email)

        delete user["password"]

        return {...user, token};
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async loginUser(values) {
    try {
      let user = await userQueries.getUserByQuery({ email: values.email })

      if (!user) {
        throw new Error("User not found");
      }

      const validPassword = bcrypt.compareSync(values.password, user.password);

      if (!validPassword) {
        throw new Error("Incorrect email or password");
      }

      const token = signToken(user.id, user.email)

      delete user['password']

      return {...user, token };
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

module.exports = new UserDAO();