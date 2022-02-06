const { userLoginService } = require('../services/users.service')


const userLogin = async (req, res) => {
  const data = req.body;
  try {
    const user = await userLoginService(data)
    return res.status(200).json(user)
  } catch (e) {
    return res.status(401).json(e.message)
  }
}

module.exports = {
  userLogin
}