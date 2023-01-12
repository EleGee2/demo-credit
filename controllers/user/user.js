const userService = require('../../services/user/user');


class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body)

      return res.status(201).json({
        message: "User created successfully",
        user
      })
    } catch (error) {
      console.error(error)
      res.status(400).json({ message: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      const user = await userService.loginUser(req.body)

      return res.status(200).json({
        message: "User logged in successfully",
        user
      })
    } catch (error) {
      console.error(error)
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();