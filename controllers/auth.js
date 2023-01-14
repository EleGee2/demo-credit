const jwt = require('jsonwebtoken')
const db = require("../db/db");
const { promisify } = require('util');
const Users = function () {
  return db("user");
};

const signToken = (id, email) => {
  const duration = 60 * 60 * 24
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: duration,
  })
}

const validateToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ') [1];
  }

  if (!token) {
    return res.status(401).json({ message: "You are not logged in! Please log in to get access." });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await Users().where({ id: decoded.id })

  if (!currentUser) {
    return res.status(401).json({ message: "This token is not valid"})
  }

  req.user = currentUser[0]
  next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: error.message})
  }
}

exports.signToken = signToken
exports.validateToken = validateToken