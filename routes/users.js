const express = require('express')
const router = express.Router()

const { userLogin } = require('../controllers/users.controller')


router.post('/login', userLogin)

module.exports = router