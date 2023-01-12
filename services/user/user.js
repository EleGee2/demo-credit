const UserDAO = require('../../dao/user')

class UserService {
  createUser(userDto) {
    return UserDAO.createUser(userDto)
  }

  loginUser(userDto) {
    return UserDAO.loginUser(userDto)
  }

}

module.exports = new UserService();