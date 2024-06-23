const router = require("express").Router()
const { loginUser, logoutUser } = require('../controllers/authController')

router.post('/login', loginUser)
router.post('/logout', logoutUser)

module.exports = router