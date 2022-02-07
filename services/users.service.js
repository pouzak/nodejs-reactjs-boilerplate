const { dbLogin } = require('../database/users.database')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userLoginService = async (data) => {
  try {
    const { name, password } = data;

    //validate inputs
    if (!name || !password) {
      throw Error('Please enter name and password.')
    }

    const { rows } = await dbLogin(data);
    if (!rows.length) throw Error('User not found.');
    // const hash = await hashPassword(password)
    // console.log(hash);
    const compare = await comparePassword(password, rows[0].password);
    if (!compare) throw Error(`Password don't match`);
    const token = await generateToken({ name: rows[0].name })

    return { token: token }
  } catch (e) {
    throw Error(e)
  }
}

async function comparePassword(newPassword, oldHash) {
  return bcrypt.compare(newPassword, oldHash);
}

async function hashPassword(passw) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(passw, salt, async (err, hash) => {
        if (err) throw reject(err);
        resolve(hash);
      });
    });
  });
}

async function generateToken(json) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      json,
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRATION) }, async (err, token) => {
        if (err) throw reject(err);
        resolve(token);
      });
  });
}

module.exports = {
  userLoginService
}