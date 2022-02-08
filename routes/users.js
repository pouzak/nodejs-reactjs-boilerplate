const express = require('express')
const router = express.Router()
const { userLogin, userCheck } = require('../controllers/users.controller')
const { auth } = require('../middleware/users.auth')


router.post('/login', userLogin)
router.get('/user', auth, userCheck)

module.exports = router